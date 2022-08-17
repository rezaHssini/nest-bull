import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import 'reflect-metadata';
import { getInstanceMetadataValue, instanceHasMetadata } from './helpers/metadata';

@Injectable()
export class ServiceExplorerService {
  constructor(private readonly discoveryService: DiscoveryService) {}

  /**
   * Finds all providers in the application that satisfies given provider filter function
   */
  public filterProviders(filter: (service: InstanceWrapper) => boolean): InstanceWrapper[] {
    return this.discoveryService.getProviders().filter((provider) => filter(provider));
  }

  /**
   * Finds all providers in the application that satisfies given provider instance filter function
   * and returns their instances
   */
  public filterWithInstances<T = any>(filter: (service: unknown) => boolean): T[] {
    return this.filterProviders(
      (provider) => provider.instance && filter(provider.instance),
    ).map((provider) => provider.instance);
  }

  /**
   * returns instances of all providers which has given metadata key
   */
  public filterWithMetadataKey<T = any>(metadataKey: string | symbol): T[] {
    return this.filterWithInstances(
      (provider: unknown) =>
        provider.constructor && instanceHasMetadata(provider, metadataKey),
    );
  }

  /**
   * returns instances of all providers which has given metadata key
   * and it's value satisfying to given filter
   */
  public filterByMetadata<T = any, R = any>(metadataKey: string | symbol, filter: (meta: T) => boolean): R[] {
    return this.filterWithMetadataKey<R>(metadataKey).filter((instance) =>
      filter(getInstanceMetadataValue(instance, metadataKey)),
    );
  }

  /**
   * returns instances of all providers which have given metadata
   * key with given metadata value
   */
  public filterByMetadataValue<T = any, R = any>(metadataKey: string | symbol, metadataValue: T): R[] {
    return this.filterByMetadata(
      metadataKey,
      // "==" is ok here
      /* tslint:disable-next-line */
      (currentValue) => currentValue == metadataValue,
    );
  }
}
