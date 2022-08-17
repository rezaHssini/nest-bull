import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { getQueueWrapperToken } from '../helpers/get-queue-wrapper-token';
import { QueueManagerService } from '../queue-manager.service';
import { QueueWrapperService } from './queue-wrapper.service';

export function getQueueWrapperProvider(queueName: string): Provider {
  return {
    provide: getQueueWrapperToken(queueName),
    inject: [QueueManagerService],
    useFactory: (queueManager: QueueManagerService) => {
      const wrapper = new QueueWrapperService(queueManager);
      wrapper.use(queueName);
      return wrapper;
    },
  };
}
