import { Type } from '@nestjs/common';

export interface IProvider {
  provider: Type;
  class: any;
}
