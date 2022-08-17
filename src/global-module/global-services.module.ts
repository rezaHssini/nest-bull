import { DynamicModule, Global, Module } from '@nestjs/common';

@Module({})
@Global()
export class GlobalServicesModule {
  static register(services: Array<any>, modules: Array<any>): DynamicModule {
    return {
      module: GlobalServicesModule,
      imports: [...modules],
      providers: [...services],
      exports: [...services, ...modules],
    };
  }
}
