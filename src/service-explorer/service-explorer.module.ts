import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ServiceExplorerService } from './service-explorer.service';

@Module({
  imports: [DiscoveryModule],
  providers: [ServiceExplorerService],
  exports: [ServiceExplorerService],
})
export class ServiceExplorerModule {}
