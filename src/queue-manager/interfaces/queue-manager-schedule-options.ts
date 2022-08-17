import { ProcessOptions } from "@nestjs/bull/dist/decorators/process.decorator";

export interface QueueManagerScheduleOptions extends ProcessOptions {
  name: string;
  title: string;
  interval: number;
  expirationTime?: number;
}
