import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { validateConfiguration } from './helpers/validation';

@Module({})
@Global()
export class ConfigurationModule {
  static register(nodeEnv: string): DynamicModule {
    const module: DynamicModule = {
      module: ConfigurationModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: nodeEnv,
          validate: validateConfiguration,
        }),
      ],
      controllers: [],
      providers: [ConfigService],
      exports: [ConfigService],
    };
    return module;
  }
}
