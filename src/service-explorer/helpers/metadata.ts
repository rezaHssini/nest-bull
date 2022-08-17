import 'reflect-metadata';

export function instanceHasMetadata(instance: any, metadataKey: symbol | string): boolean {
  if (!instance?.constructor) {
    return false;
  }
  return Reflect.hasMetadata(metadataKey, instance.constructor);
}

export function getInstanceMetadataValue(instance: any, metadataKey: symbol | string): any {
  if (!instance?.constructor) {
    return undefined;
  }
  return Reflect.getMetadata(metadataKey, instance.constructor);
}

export function compareByMetaData<T = any>(metadataKey: symbol | string, cb: (a: T, b: T) => number): (a: T, b: T) => number {

  return (a: any, b: any): number => {

    const firstValue = getInstanceMetadataValue(a, metadataKey);

    const secondValue = getInstanceMetadataValue(b, metadataKey);

    return cb(firstValue, secondValue);
  };
}
