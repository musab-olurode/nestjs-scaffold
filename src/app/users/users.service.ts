import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@/app/users/entities/user.entity';

import { CreateUserDto } from '@/app/users/dto/create-user.dto';
import { UpdateUserDto } from '@/app/users/dto/update-user.dto';

import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';
import { PaginationService } from '@/pagination/pagination.service';

import { SuccessResponse } from '@/utils/response';

import { FilterOperator, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly logger: WinstonLoggerService,
	) {
		this.logger.setContext(UsersService.name);
	}

	async create(createUserDto: CreateUserDto) {
		const user = this.userRepository.create(createUserDto);

		return await this.userRepository.save(user);
	}

	findAll(query: PaginateQuery) {
		return PaginationService.paginate(query, this.userRepository, {
			searchableColumns: ['firstName', 'lastName', 'email'],
			filterableColumns: {
				firstName: [FilterOperator.EQ],
			},
		});
	}

	async getOne(id: string) {
		const user = await this.userRepository.findOneBy({ id });

		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`);
		}

		return user;
	}

	async findOne(id: string) {
		const user = await this.getOne(id);

		return new SuccessResponse('User retrieved', user);
	}

	async findOneProfile(id: string) {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.id = :id', { id })
			.getOne();

		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`);
		}

		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.getOne(id);

		Object.assign(user, updateUserDto);
		const updatedUser = await this.userRepository.save(user);

		return new SuccessResponse('User updated', updatedUser);
	}

	remove(id: string) {
		return `This action removes a #${id} user`;
	}
}
