import { getMetadataArgsStorage } from 'typeorm';

export function TransactionManager(): ParameterDecorator {
  return (object, methodName, index) => {
    getMetadataArgsStorage().transactionEntityManagers.push({
      target: object.constructor,
      methodName: methodName.toString(),
      index: +index,
    });
  };
}
