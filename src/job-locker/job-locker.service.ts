import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LockedJobs } from '../entities/locked-jobs';
import { Transaction } from '../mixins/decorators/transaction';
import { TransactionManager } from '../mixins/decorators/transaction-manager';

const UNIQUE_KEY = 'UNIQUE_KEY';

@Injectable()
export class JobLockerService {
  constructor(
    @InjectRepository(LockedJobs) private lockRepo: Repository<LockedJobs>,
  ) {}

  @Transaction()
  async lock(
    queue: string,
    job: string,
    expireIn: number,
    @TransactionManager() manager?: EntityManager,
  ): Promise<string | undefined | null> {
    const key = this.getKey(queue, job);
    const repo = manager.getRepository(LockedJobs);
    const lock = await this.findJobByKey(key, repo);
    if (lock && lock.expireTime > new Date()) {
      return;
    }

    if (!lock) {
      const newLock = await this.lockNew(key, expireIn, repo);
      return newLock ? newLock.lockId : null;
    }
    const lockId = this.getLockId();
    await repo.update(
      { key },
      {
        lockId,
        expireTime: this.getExpireDate(expireIn),
        createdAt: new Date(),
      },
    );
    return lockId;
  }

  async unlock(queue: string, job: string, lockId: string): Promise<void> {
    const key = this.getKey(queue, job);
    await this.lockRepo.delete({ key, lockId });
  }

  private async findJobByKey(
    key: string,
    repo: Repository<LockedJobs>,
  ): Promise<LockedJobs | null> {
    return await repo
      .createQueryBuilder()
      .setLock('pessimistic_write')
      .where('key=:key', { key })
      .getOne();
  }

  private getKey(queue: string, job: string): string {
    return `${UNIQUE_KEY}-${queue}-${job}`;
  }

  private async lockNew(
    key: string,
    expireIn: number,
    repo?: Repository<LockedJobs>,
  ): Promise<LockedJobs | null> {
    repo = repo || this.lockRepo;
    const lock = new LockedJobs();
    lock.key = key;
    lock.lockId = this.getLockId();
    lock.expireTime = this.getExpireDate(expireIn);

    try {
      await repo.save(lock);
      return lock;
    } catch (e) {
      return null;
    }
  }

  private getExpireDate(expireIn: number): Date {
    return new Date(Date.now() + expireIn);
  }

  private getLockId(): string {
    return uuidv4();
  }
}
