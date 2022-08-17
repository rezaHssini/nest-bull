import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class LockedJobs {
  @Index()
  @PrimaryColumn()
  key: string;

  @Index()
  @Column()
  lockId: string;

  @Index()
  @Column({ default: false })
  lockedByAdmin?: boolean;

  @Index()
  @Column({ default: false })
  lastJobWasFinished?: boolean;

  @Column({ type: 'timestamp' })
  expireTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
