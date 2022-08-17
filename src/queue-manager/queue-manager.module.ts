import { BullModule } from "@nestjs/bull";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { ServiceExplorerModule } from "../service-explorer/service-explorer.module";
import { JOB_LOCKER, NOTIFICATION_SENDER } from "./constants";
import { DepService } from "./interfaces/dep-service";
import { JobLocker } from "./interfaces/job-locker";
import { NotificationSender } from "./interfaces/notification-sender";
import { QueueManagerModuleParams } from "./interfaces/queue-manager-module-params";
import { QueueManagerService } from "./queue-manager.service";
import { getQueueWrapperProvider } from "./queue-wrapper/get-queue-wrapper-provider";
import { queuesList } from "./queues-list";
import { queueWrappersList } from "./queueWrappersList";

@Module({
  providers: [],
  exports: [],
})
@Global()
export class QueueManagerModule {
  static register(config: QueueManagerModuleParams): DynamicModule {
    const queues = queuesList.map((opts) => BullModule.registerQueue(opts));
    const queueWrappers = Array.from(
      queueWrappersList,
      getQueueWrapperProvider
    );
    const result = {
      module: QueueManagerModule,
      imports: [...queues, DiscoveryModule, ServiceExplorerModule],
      providers: [QueueManagerService, ...queueWrappers],
      exports: [QueueManagerService, ...queues, ...queueWrappers],
    };
    QueueManagerModule.importLocker(config.locker, result);
    QueueManagerModule.importNotificationSender(
      config.notificationSender,
      result
    );
    return result;
  }

  private static importLocker(
    locker: DepService<JobLocker>,
    moduleConfig: DynamicModule
  ): void {
    const res = QueueManagerModule.importDefault(
      locker,
      moduleConfig,
      JOB_LOCKER
    );
    if (res) {
      return;
    }
    const service = locker.service;
    if (
      locker &&
      (service as JobLocker).lock &&
      (service as JobLocker).unlock
    ) {
      moduleConfig.providers.push({ provide: JOB_LOCKER, useValue: locker });
      return;
    }
    throw new Error(
      "QueueManagerModule.register takes either locker object either locker service with corresponding module."
    );
  }

  private static importNotificationSender(
    sender: DepService<NotificationSender>,
    moduleConfig: DynamicModule
  ): void {
    const res = QueueManagerModule.importDefault(
      sender,
      moduleConfig,
      NOTIFICATION_SENDER
    );
    if (res) {
      return;
    }
    const service = sender.service;
    if (service && (service as NotificationSender).send) {
      moduleConfig.providers.push({
        provide: NOTIFICATION_SENDER,
        useValue: service,
      });
      return;
    }
    throw new Error(
      "QueueManagerModule.register takes either locker object either locker service with corresponding module."
    );
  }

  private static importDefault<T>(
    dep: DepService<T>,
    moduleConfig: DynamicModule,
    providerName: symbol
  ): boolean {
    const [service, module] = [dep.service, dep.module];
    if (typeof service === "function" && typeof module === "function") {
      moduleConfig.imports.push(module);
      moduleConfig.providers.push({
        provide: providerName,
        useFactory: (instance: T) => instance,
        inject: [service],
      });
      return true;
    }
    return false;
  }
}
