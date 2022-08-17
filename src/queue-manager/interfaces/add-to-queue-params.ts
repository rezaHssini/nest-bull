import { JobOptions } from 'bull';

export interface AddToQueueParams<T> {
  name?: string;
  data: T;
  opts: JobOptions;
}
