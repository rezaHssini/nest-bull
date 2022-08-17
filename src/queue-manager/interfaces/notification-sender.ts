import { NotificationDto } from "../../mixins/dto/notification.dto";

export interface NotificationSender {
  send: (notificationBody: NotificationDto | string) => Promise<void>;
}
