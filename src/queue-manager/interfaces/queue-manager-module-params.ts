import { DepService } from './dep-service';
import { JobLocker } from './job-locker';
import { NotificationSender } from './notification-sender';

export interface QueueManagerModuleParams {
  locker: DepService<JobLocker>;
  notificationSender: DepService<NotificationSender>;
}
