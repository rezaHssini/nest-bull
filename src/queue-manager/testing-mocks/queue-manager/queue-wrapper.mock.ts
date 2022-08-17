export class QueueWrapperMock {
  async add(): Promise<void> {}
  async getInQueue(): Promise<any[]> {
    return [];
  }
  async getQueueLength(jobName?: string): Promise<number> {
    return 0;
  }
}
