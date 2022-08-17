import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockedJobs } from '../entities/locked-jobs';
import { JobLockerService } from './job-locker.service';

@Module({
  imports: [TypeOrmModule.forFeature([LockedJobs])],
  controllers: [],
  providers: [JobLockerService],
  exports: [JobLockerService],
})
export class JobLockerModule {}
