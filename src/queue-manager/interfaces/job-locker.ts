type LockFn = (queueName: string, jobName: string, expireTime: number) => Promise<string | null | undefined>;
type UnlockFn = (queueName: string, jobName: string, lockId: string) => Promise<void>;

export interface JobLocker {
  lock: LockFn;
  unlock: UnlockFn;
}
