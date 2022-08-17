import { Type } from '@nestjs/common';

export type DepService<T> = {
  service: T;
  module?: never;
} | {
  service: Type<T>;
  module: Type;
};

