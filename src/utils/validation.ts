import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const combinedErrorMessagesString =
    errors
      .map((error) => {
        const errorValues = Object.values(error.constraints);
        const capitalizedErrorValues = errorValues.map((value) => {
          return value.charAt(0).toUpperCase() + value.slice(1);
        });
        return capitalizedErrorValues;
      })
      .flat()
      .join(', ') + '.';
  return new BadRequestException(combinedErrorMessagesString);
};
