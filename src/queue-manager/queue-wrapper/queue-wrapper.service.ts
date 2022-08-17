import { getQueueToken } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, JobOptions, Queue } from 'bull';
import { DEFAULT_JOB_RETRY_PERIOD, DEFAULT_MAX_JOB_ATTEMPTS } from '../constants';
import { AddToQueueParams } from '../interfaces/add-to-queue-params';
import { QueueManagerService } from '../queue-manager.service';

@Injectable()
export class QueueWrapperService<T = any> {
  public queue: Queue;

  constructor(
    private readonly queueManager: QueueManagerService
  ) {}

  getManager(): QueueManagerService {
    return this.queueManager;
  }

  use(queueName: string): void {
    const queueToken = getQueueToken(queueName);
    this.queue = this.queueManager.getQueue(queueToken);
  }

  add(data: T, opts?: JobOptions): Promise<Job<T>>;
  add(name: string, data: T, opts?: JobOptions): Promise<Job<T>>;
  add(nameOrData: string | T, optsOrData: JobOptions | T, optsVal?: JobOptions): Promise<Job<T>> {
    const { name, data, opts } = this.getAddParams(nameOrData, optsOrData, optsVal);

    return name ? this.queue.add(name, data, opts) : this.queue.add(data, opts);
  }

  async getInQueue(jobName?: string): Promise<T[]> {
    const [allActive, allWaiting, allDelayed] = await Promise.all<Job<T>[]>([
      this.queue.getActive(), this.queue.getWaiting(), this.queue.getDelayed()
    ]);
    return allActive
      .concat(allWaiting)
      .concat(allDelayed)
      .filter((job: Job) => job && job?.name === jobName)
      .map(job => job?.data)
      .filter(Boolean);
  }

  async getQueueLength(jobName?: string): Promise<number> {
    const active = await this.queue.getActiveCount();
    const waiting = await this.queue.getWaitingCount();
    const delayed = await this.queue.getDelayedCount();
    return (+active || 0) + (+waiting || 0) + (+delayed || 0)
  }
  private getAddParams(nameOrData: string | T, optsOrData: JobOptions | T, opts?: JobOptions): AddToQueueParams<T> {
    let name: string | undefined;
    let data: T;
    const optsDefault = { removeOnComplete: true, removeOnFail: true };

    if (typeof nameOrData === 'string') {
      name = nameOrData;
      data = optsOrData as T;
      opts = opts || {};
    } else {
      data = nameOrData as T;
      opts = optsOrData || {};
    }
    const defaultRetryOptions = {
      attempts: DEFAULT_MAX_JOB_ATTEMPTS,
      backoff: DEFAULT_JOB_RETRY_PERIOD,
    };

    const processOptions = this.queueManager.getProcessOptionsByQueueAndName(this.queue.name, name);
    const retryConfig = { ...defaultRetryOptions, ...processOptions.retryOptions };
    opts = { ...optsDefault, ...retryConfig, ...opts };
    return { name, data, opts };
  }
}
