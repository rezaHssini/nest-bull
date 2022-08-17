import { Queue } from 'bull';
import { JobProcessOptions } from '../../interfaces/job-process-options';

export class QueueManagerServiceMock {
  getQueue(): Queue {
    return null;
  }
  getProcessOptionsByQueueAndName(): JobProcessOptions | null {
    return null;
  }

}
