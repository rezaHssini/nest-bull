import { ValidationArguments } from 'class-validator';

export function ValidateEnumErrorMessageTemplate(args: ValidationArguments): string {
  return `"${args.value}" is invalid value for ${args.property} allowed values for [${Object.values(args.constraints[0]).join(', ')}]`;
}
