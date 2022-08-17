import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { LockedJobs } from '../../entities/locked-jobs';

export function getEntities(): EntityClassOrSchema[] {
  return [LockedJobs];
}
