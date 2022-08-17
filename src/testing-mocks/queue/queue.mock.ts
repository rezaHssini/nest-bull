import { getQueueToken } from '@nestjs/bull';
import { Provider } from '@nestjs/common';
import { Job, Queue } from 'bull';

export class QueueMock implements Partial<Queue> {
  async process(...args: any[]): Promise<void> {}
  async add(): Promise<Job> {
    return {} as unknown as Job;
  }
  async getActive(): Promise<Job[]> {
    return [];
  }
  async getWaiting(): Promise<Job[]> {
    return [];
  }
  async empty(): Promise<void> {}

  on(event, callvack): Queue<any> {
    return this as unknown as Queue<any>;
  }
  async getActiveCount(): Promise<number> {
    return 0;
  }
  async getWaitingCount(): Promise<number> {
    return 0;
  }
}

export function getQueueMockProvider(name: string): Provider<QueueMock> {
  return {
    provide: getQueueToken(name),
    useClass: QueueMock,
  };
}
