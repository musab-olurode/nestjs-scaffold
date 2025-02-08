import {
	paginate as nestjsPaginate,
	PaginateConfig,
	PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { ObjectLiteral, Repository } from 'typeorm';

export class PaginationService {
	static paginate<T extends ObjectLiteral>(
		query: PaginateQuery,
		repository: Repository<T>,
		config?: PaginateConfig<T>,
	) {
		return nestjsPaginate(query, repository, {
			sortableColumns: ['createdAt' as Column<T>],
			nullSort: 'last',
			defaultSortBy: [['createdAt' as Column<T>, 'DESC']],
			defaultLimit: 50,
			...config,
		});
	}
}
