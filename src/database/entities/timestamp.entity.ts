import { ColumnOrder, getColumnOrder } from '@/decorators/order.decorator';

import {
	BaseEntity,
	CreateDateColumn,
	DataSource,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

export abstract class Timestamp extends BaseEntity {
	@ColumnOrder(-1)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ColumnOrder(9997)
	@CreateDateColumn()
	createdAt: Date;

	@ColumnOrder(9998)
	@UpdateDateColumn()
	updatedAt: Date;

	@ColumnOrder(9999)
	@DeleteDateColumn()
	deletedAt?: Date;

	static useDataSource(dataSource: DataSource) {
		BaseEntity.useDataSource.call(this, dataSource);
		const meta = dataSource.entityMetadatasMap.get(this);
		const getOrderSafely = (column: ColumnMetadata) => {
			const target = column.target as
				| { prototype: object | undefined }
				| undefined;

			// Check if the target and its prototype exist
			if (target && target.prototype) {
				// Retrieve the column order using the custom getColumnOrder function
				return getColumnOrder(target.prototype, column.propertyName);
			}

			// Fallback to a default high order value if target is undefined
			return 9996;
		};

		if (meta != null) {
			// Reorder columns based on custom `@ColumnOrder` decorator
			meta.columns = [...meta.columns].sort((xColumn, yColumn) => {
				// Get the order values for both columns being compared
				const orderXColumn = getOrderSafely(xColumn);
				const orderYColumn = getOrderSafely(yColumn);

				// Sort in ascending order
				return orderXColumn - orderYColumn;
			});
		}
	}
}
