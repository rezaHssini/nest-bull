import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '../config-module/config.service';

export function postgresDbConfig(configService: ConfigService): TypeOrmModuleOptions {
  return configService.getDatabaseConfig();
}
