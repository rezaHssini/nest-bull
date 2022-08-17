import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getConfiguration, getParam } from './helpers/env-variable-mapper';
import { IConfig } from './interface/config.interface';
import { INotificationServiceConfig } from './interface/notification-service-config';
import { IRedisConfig } from './interface/redis-config';

@Injectable()
export class ConfigService {
  private _config: IConfig;

  getDatabaseConfig(): TypeOrmModuleOptions {
    const config = this.getConfigs();
    return config.database;
  }

  getRedisConfig(): IRedisConfig {
    const config = this.getConfigs();
    return config.redis;
  }

  getNotificationServiceConfig(): INotificationServiceConfig {
    const config = this.getConfigs();
    return config.notificationService;
  }

  getEnv<T = string>(name: string): T {
    let param = getParam(name) as any;
    if (!param) {
      return null;
    }
    return param as T;
  }

  private getConfigs(): IConfig {
    if (!this._config) {
      this._config = getConfiguration();
    }
    return this._config;
  }
}
