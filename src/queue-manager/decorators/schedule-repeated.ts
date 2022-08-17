import { AsyncMethodDecorator } from '../../mixins/decorators/async-method-decorator';
import { REPEATED_TASK_META } from '../constants';
import { QueueManagerScheduleOptions } from '../interfaces/queue-manager-schedule-options';

export function ScheduleRepeated(
  nameOrOptions: QueueManagerScheduleOptions,
): AsyncMethodDecorator;

export function ScheduleRepeated(
  nameOrOptions: string,
  interval: number,
  expirationTime?: number,
): AsyncMethodDecorator;

export function ScheduleRepeated(
  nameOrOptions: QueueManagerScheduleOptions | string,
  interval?: number,
  expirationTime = 6e5,
): AsyncMethodDecorator {
  const options: QueueManagerScheduleOptions = getOptions(
    nameOrOptions,
    interval,
    expirationTime,
  );
  checkOptions(options);
  return Reflect.metadata(REPEATED_TASK_META, options);

  function getOptions(
    optionsOrName: QueueManagerScheduleOptions | string,
    repeat?,
    expireIn = expirationTime,
  ): QueueManagerScheduleOptions {
    const opts = { name: '', title: '', interval: 0, expirationTime: 0 };
    if (typeof optionsOrName === 'string') {
      opts.name = optionsOrName;
      opts.title = optionsOrName;
      opts.interval = repeat;
      opts.expirationTime = expireIn;
    } else {
      opts.name = optionsOrName.name;
      opts.title = optionsOrName.title;
      opts.interval = optionsOrName.interval;
      opts.expirationTime = optionsOrName.expirationTime || expireIn;
    }
    return opts;
  }

  function checkOptions(opts: QueueManagerScheduleOptions): void {
    if (!opts.name) {
      throw new Error('Name is required for ScheduleRepeated decorator');
    }
    if (!+opts.interval || opts.interval < 0) {
      throw new Error(
        'Interval should be a positive integer for ScheduleRepeated decorator',
      );
    }
  }
}
