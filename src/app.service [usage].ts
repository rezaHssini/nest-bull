import { InjectQueueWrapper } from './queue-manager/decorators/inject-queue-wrapper';
import { JobProcess } from './queue-manager/decorators/job-process';
import { QueueProcessor } from './queue-manager/decorators/queue-processor';
import { ScheduleRepeated } from './queue-manager/decorators/schedule-repeated';
import { QueueWrapperService } from './queue-manager/queue-wrapper/queue-wrapper.service';
import { Job } from 'bull';
import { DEFAULT_TEST_QUEUE_PERIOD, TEST_QUEUE_NAME } from './constants';

const jobName = 'test-job';

@QueueProcessor(TEST_QUEUE_NAME)
export class AppService {
  constructor(
    @InjectQueueWrapper(TEST_QUEUE_NAME)
    private readonly queue: QueueWrapperService,
  ) {}

  @ScheduleRepeated({
    title: 'test queue',
    name: 'test-queue',
    interval: +process.env.QUEUE_PERIOD || DEFAULT_TEST_QUEUE_PERIOD,
  })
  async getNewConsolidations(): Promise<void> {
    const jobs = await this.getJobsInQueue(jobName);
    if (!jobs?.length) {
      for (let index = 0; index < 50; index++) {
        this.addJob(jobName, index);
      }
    }
  }

  @JobProcess({
    name: jobName,
    retryOptions: {
      attempts: 1,
    },
    getSentError: (d) => `Failed to handle job with id ${d.id}`,
  })
  async testJobProcessor(job: Job<{ id: number }>): Promise<void> {
    console.log(`Handling hob with id ${job.data.id}`);
  }

  private async addJob(jobName: string, id: number): Promise<void> {
    await this.queue.add(
      jobName,
      { id },
      {
        removeOnFail: true,
        removeOnComplete: true,
      },
    );
  }

  private async getJobsInQueue(name: string): Promise<number[]> {
    const result = await this.queue.getInQueue(name);
    return result.map((data) => +data?.id).filter(Boolean);
  }
}
