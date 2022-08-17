import { DatabaseTypes } from '../enum/database-type.enum';
import { IConfig } from '../interface/config.interface';
import { readFileSync } from 'fs';
import { getEntities } from '../../mixins/helpers/get-entities';

export function getConfiguration(): IConfig {
  return {
    database: {
      type: <DatabaseTypes.POSTGRES>process.env.TYPEORM_TYPE,
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: getEntities(),
      keepConnectionAlive: true,
      synchronize: process.env.TYPEORM_SYNC?.length ? JSON.parse(process.env.TYPEORM_SYNC) : false,
      ssl:
        process.env.TYPEORM_SSL_ON?.length && JSON.parse(process.env.TYPEORM_SSL_ON) === true
          ? {
              ca: readFileSync(process.env.TYPEORM_SSL_CA, 'utf-8'),
              key: process.env.TYPEORM_SSL_KEY ? readFileSync(process.env.TYPEORM_SSL_KEY, 'utf-8') : null,
              cert: process.env.TYPEORM_SSL_CERT ? readFileSync(process.env.TYPEORM_SSL_CERT, 'utf-8') : null,
            }
          : null,
    },
    redis: {
      protocol: process.env.REDIS_PROTOCOL || 'redis',
      username: process.env.REDIS_USERNAME || '',
      password: process.env.REDIS_PASSWORD || '',
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      db: +process.env.REDIS_DB || 0,
    },
    notificationService: {
      url: process.env.NOTIFICATIN_MS_URL,
      channelName: process.env.NOTIFICATION_CHANNEL_NAME,
      botIcon: process.env.NOTIFICATION_BOT_ICON,
      disabled: process.env.NOTIFICATION_DISABLED?.length ? JSON.parse(process.env.NOTIFICATION_DISABLED) : false,
      sendNotificationForAllTransactions: process.env.SEND_NOTIFICATION_FOR_ALL_TRANSACTIONS?.length
        ? JSON.parse(process.env.SEND_NOTIFICATION_FOR_ALL_TRANSACTIONS)
        : false,
    },
  };
}

export function getParam(name: string): string | null {
  return process.env[name];
}
