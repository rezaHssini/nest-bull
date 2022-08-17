import { BullModuleOptions } from '@nestjs/bull';
import { QUEUE_MANAGER_PROCESSOR } from '../constants';
import { queuesList } from '../queues-list';

export function QueueProcessor(options?: BullModuleOptions | string): ClassDecorator {
  const opts: BullModuleOptions = typeof options === 'string' ? { name: options } : options;
  if (opts) {
    queuesList.push(opts);
  }
  return Reflect.metadata(QUEUE_MANAGER_PROCESSOR, opts);
}
