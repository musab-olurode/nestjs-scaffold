const ORDER_KEY = Symbol.for('orderKey');
export function ColumnOrder(value: number): PropertyDecorator {
	return (target, propertyKey) => {
		Reflect.defineMetadata(ORDER_KEY, value, target, propertyKey);
	};
}

export function getColumnOrder(
	target: unknown,
	propertyKey: string | symbol,
	defaultVal = 0,
) {
	const result = Reflect.getMetadata(ORDER_KEY, target, propertyKey);
	if (typeof result === 'number') {
		return result;
	}

	return defaultVal;
}
