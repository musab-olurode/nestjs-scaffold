import {
  PaginateQuery,
  paginate as nestjsPaginate,
  PaginateConfig,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';

export class PaginationService {
  static paginate<T>(
    query: PaginateQuery,
    repository: Repository<T>,
    config?: PaginateConfig<T>,
  ) {
    return nestjsPaginate<T>(query, repository, {
      sortableColumns: ['createdAt' as any],
      nullSort: 'last',
      defaultSortBy: [['createdAt' as any, 'DESC']],
      defaultLimit: 50,
      ...config,
    });
  }
}
