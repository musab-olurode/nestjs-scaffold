import { ClassConstructor } from 'class-transformer';
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

export const IsMatch = <T>(
	type: ClassConstructor<T>,
	property: (o: T) => unknown,
	validationOptions?: ValidationOptions,
) => {
	return (object: object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [property],
			validator: IsMatchConstraint,
		});
	};
};

@ValidatorConstraint({ name: 'IsMatch' })
export class IsMatchConstraint implements ValidatorConstraintInterface {
	validate(value: unknown, args: ValidationArguments) {
		const [fn] = args.constraints;

		return fn(args.object) === value;
	}

	defaultMessage(args: ValidationArguments) {
		const [constraintProperty]: string[] = args.constraints;

		return `${constraintProperty} and ${args.property} does not match`;
	}
}
