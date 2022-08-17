import { Inject } from '@nestjs/common';
import { getQueueWrapperToken } from '../helpers/get-queue-wrapper-token';
import { queueWrappersList } from '../queueWrappersList';

export function InjectQueueWrapper(queueName): ParameterDecorator {
  queueWrappersList.add(queueName);
  return Inject(getQueueWrapperToken(queueName));
}
