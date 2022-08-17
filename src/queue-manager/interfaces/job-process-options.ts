import { ProcessOptions } from '@nestjs/bull';
import { BackoffOptions } from 'bull';
import { NotificationDto } from '../../mixins/dto/notification.dto';

export interface JobProcessOptions<T = any> extends ProcessOptions {
  retryOptions?: {
    attempts: number;
    backoff?: number | BackoffOptions
  };
  getSentError?: (data: T) => string | NotificationDto;
}
