import { Module } from '@nestjs/common';
import { AppService } from './app.service [usage]';
import { ConfigurationModule } from './config-module/config.module';
import { ConfigService } from './config-module/config.service';
import { postgresDbConfig } from './module-configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ServiceExplorerModule } from './service-explorer/service-explorer.module';
import { QueueManagerModule } from './queue-manager/queue-manager.module';
import { JobLockerService } from './job-locker/job-locker.service';
import { JobLockerModule } from './job-locker/job-locker.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsService } from './notifications/notifications.service';
import { GlobalServicesModule } from './global-module/global-services.module';
import { getEntities } from './mixins/helpers/get-entities';
import { TypeormConnection } from './global-module/services/typeorm-connection';
import { MixinsModule } from './mixins/mixins.module';

@Module({
  imports: [
    ConfigurationModule.register(
      process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
    ),
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: (contigService: ConfigService) =>
        postgresDbConfig(contigService),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [],
      useFactory: (config: ConfigService) => ({
        redis: config.getRedisConfig(),
      }),
      inject: [ConfigService],
    }),
    ServiceExplorerModule,
    QueueManagerModule.register({
      locker: {
        service: JobLockerService,
        module: JobLockerModule,
      },
      notificationSender: {
        service: NotificationsService,
        module: NotificationsModule,
      },
    }),
    JobLockerModule,
    GlobalServicesModule.register(
      [TypeormConnection],
      [TypeOrmModule.forFeature(getEntities())],
    ),
    NotificationsModule,
    MixinsModule,
  ],

  providers: [AppService],
})
export class AppModule {}
