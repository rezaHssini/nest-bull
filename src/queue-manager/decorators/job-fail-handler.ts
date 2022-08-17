import { JOB_FAIL_META } from '../constants';

export function JobFailHandler(jobName: string): MethodDecorator {
  return Reflect.metadata(JOB_FAIL_META, jobName);
}
