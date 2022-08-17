import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { INotificationServiceConfig } from './notification-service-config';
import { IRedisConfig } from './redis-config';

export interface IConfig {
  database: TypeOrmModuleOptions;
  redis: IRedisConfig;
  notificationService: INotificationServiceConfig;
}
