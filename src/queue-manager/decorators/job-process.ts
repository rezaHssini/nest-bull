import { AsyncMethodDecorator } from '../../mixins/decorators/async-method-decorator';
import { JOB_PROCESS_META } from '../constants';
import { JobProcessOptions } from '../interfaces/job-process-options';

export function JobProcess<T = any>(
  nameOrOptions: JobProcessOptions<T> | string,
): AsyncMethodDecorator {
  const options =
    typeof nameOrOptions === 'string' ? { name: nameOrOptions } : nameOrOptions;
  return Reflect.metadata(JOB_PROCESS_META, options);
}
