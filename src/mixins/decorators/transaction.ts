import { Inject, Optional } from '@nestjs/common';
import * as tslib_1 from 'tslib';
import { getMetadataArgsStorage, MongoRepository, Repository, TreeRepository } from 'typeorm';
import { TypeormConnection } from '../../global-module/services/typeorm-connection';

export function Transaction(instanceKey = '__typeormConnection'): MethodDecorator {
  const injectConnection = Inject(TypeormConnection);
  return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    if (!target[instanceKey]) {
      try {
        injectConnection(target, instanceKey);
        Optional()(target, instanceKey);
      } catch (e) {}
    }

    // save original method - we gonna need it
    const originalMethod = propertyDescriptor.value;
    // override method descriptor with proxy method
    propertyDescriptor.value = async function(): Promise<any> {
      const context = this;
      const typeormConn: TypeormConnection = this[instanceKey];

      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }

      const transactionCallback = (entityManager) => {
        let argsWithInjectedTransactionManagerAndRepositories;
        // filter all @TransactionManager() and @TransactionRepository() decorator usages for this method
        const transactionEntityManagerMetadatas = getMetadataArgsStorage()
          .filterTransactionEntityManagers(target.constructor, propertyKey)
          .reverse();
        const transactionRepositoryMetadatas = getMetadataArgsStorage()
          .filterTransactionRepository(target.constructor, propertyKey)
          .reverse();
        // if there are @TransactionManager() decorator usages the inject them
        if (transactionEntityManagerMetadatas.length > 0) {
          argsWithInjectedTransactionManagerAndRepositories = tslib_1.__spreadArray([], tslib_1.__read(args));
          // replace method params with injection of transactionEntityManager
          transactionEntityManagerMetadatas.forEach((metadata) => {
            argsWithInjectedTransactionManagerAndRepositories.splice(metadata.index, 0, entityManager);
          });
        } else if (transactionRepositoryMetadatas.length === 0) {
          // otherwise if there's no transaction repositories in use, inject it as a first parameter
          argsWithInjectedTransactionManagerAndRepositories = tslib_1.__spreadArray([entityManager], tslib_1.__read(args));
        } else {
          argsWithInjectedTransactionManagerAndRepositories = tslib_1.__spreadArray([], tslib_1.__read(args));
        }
        // for every usage of @TransactionRepository decorator
        transactionRepositoryMetadatas.forEach((metadata) => {
          let repositoryInstance;
          // detect type of the repository and get instance from transaction entity manager
          switch (metadata.repositoryType) {
            case Repository:
              repositoryInstance = entityManager.getRepository(metadata.entityType);
              break;
            case MongoRepository:
              repositoryInstance = entityManager.getMongoRepository(metadata.entityType);
              break;
            case TreeRepository:
              repositoryInstance = entityManager.getTreeRepository(metadata.entityType);
              break;
            // if not the TypeORM's ones, there must be custom repository classes
            default:
              repositoryInstance = entityManager.getCustomRepository(metadata.repositoryType);
          }
          // replace method param with injection of repository instance
          argsWithInjectedTransactionManagerAndRepositories.splice(metadata.index, 0, repositoryInstance);
        });
        return originalMethod.apply(context, argsWithInjectedTransactionManagerAndRepositories);
      };
      return typeormConn.getConnection().manager.transaction(transactionCallback);
    };
  };
}
