import { SetMetadata } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import 'reflect-metadata';
import { ServiceExplorerService } from './service-explorer.service';

const TEST_PROVIDER = Symbol('TEST_PROVIDER');

@SetMetadata<symbol, string>(TEST_PROVIDER, '123')
class TestProvider {}

describe('ServiceExplorerService', () => {
  let service: ServiceExplorerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [
        ServiceExplorerService,
        {
          provide: 'TEST123',
          useValue: '123',
        },
        {
          provide: 'TEST',
          useClass: TestProvider,
        },
      ],
    }).compile();

    service = module.get<ServiceExplorerService>(ServiceExplorerService);
  });

  it('should filter providers', () => {
    const filter = (provider) => provider.name === 'TEST123';
    const providers = service.filterProviders(filter);
    expect(providers.length).toBeGreaterThan(0);
    expect(providers[0].instance).toBe('123');
  });

  it('should filter instances', () => {
    const filter = (instance) => instance === '123';
    const instances = service.filterWithInstances(filter);
    expect(instances.length).toBeGreaterThan(0);
    expect(instances[0]).toBe('123');
  });

  it('should filter instances by metadata key flag', () => {
    const metaDataKey = TEST_PROVIDER;
    const instances = service.filterWithMetadataKey(metaDataKey);
    expect(instances.length).toBeGreaterThan(0);
    expect(instances[0]).toBeInstanceOf(TestProvider);
  });

  it('should filter instances by metadata filter', () => {
    const metaDataKey = TEST_PROVIDER;
    const filter = (metadata) => metadata === '123';
    const instances = service.filterByMetadata(metaDataKey, filter);
    expect(instances.length).toBeGreaterThan(0);
    expect(instances[0]).toBeInstanceOf(TestProvider);
  });

  it('should filter instances by metadata value', () => {
    const metaDataKey = TEST_PROVIDER;
    const metadataValue = '123';
    const instances = service.filterByMetadataValue(metaDataKey, metadataValue);
    expect(instances.length).toBeGreaterThan(0);
    expect(instances[0]).toBeInstanceOf(TestProvider);
  });
});
