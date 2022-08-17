import { DatabaseTypes } from '../config-module/enum/database-type.enum';

const config = {
  database: {
    type: DatabaseTypes.POSTGRES,
    host: 'localhost',
    port: 1234,
    username: 'username',
    password: 'password',
    database: 'test-database',
    synchronize: true,
    ssl: {
      ca: 'ca',
      key: 'key',
      cert: 'cert',
    },
  },

  redis: {
    protocol: 'redis',
    username: '',
    password: '',
    host: 'localhost',
    port: 1234,
  },
};

export class Config {
  getDatabaseConfig(): any {
    return config.database;
  }

  getRedisConfig(): any {
    return config.redis;
  }

  getNotificationServiceConfig(): any {
    return {
      url: '',
      channelName: '',
      botIcon: '',
      disabled: true,
    };
  }

  getEnv(name: string): any {
    return name;
  }

  get(name: string): any {
    return name;
  }

  static setConfig(name: string, data: object): void {
    Object.keys(data).forEach((key) => {
      config[name][key] = data[key];
    });
  }
}
