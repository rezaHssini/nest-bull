import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { NotificationDto } from '../mixins/dto/notification.dto';
import { ConfigService } from '../config-module/config.service';
import { NOTIFICATION_DISABLED } from './constants';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}
  async send(notificationBody: NotificationDto | string): Promise<void> {
    const isNotifyActive = this.isNotificationActive();
    if (!isNotifyActive) {
      return;
    }
    if (typeof notificationBody === 'string') {
      return;
    }
    const { url } = this.config.getNotificationServiceConfig();
    if (!url) {
      throw new Error("Can't send notification: URL is unknown.");
    }

    let response;
    const source = 'test-service';
    const response$ = this.http.post(url, { ...notificationBody, source });
    try {
      response = await firstValueFrom(response$);
    } catch (e) {
      const dataStr = JSON.stringify(e.response?.data || {});
      const msg = `${e.message}: (${dataStr})`;
      throw new Error(msg);
    }
    if (response.status > 400) {
      throw new Error(
        `Failed to send notification: ${response.status} ${response.statusText}`,
      );
    }
  }
  isNotificationActive(): boolean {
    const notificationDisabled =
      this.config.getNotificationServiceConfig().disabled ||
      NOTIFICATION_DISABLED;
    return notificationDisabled === 'false';
  }
}
