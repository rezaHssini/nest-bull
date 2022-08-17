import { QueryRunner } from 'typeorm';
import { RepositoryMock } from './repository.mock';

export class ConnectionMock {
  public qr: QueryRunner;
  public manager: {
    transaction: (arg: any) => void;
    getRepository: (arg: any) => RepositoryMock;
  };
  constructor() {
    this.qr = {
      manager: {},
    } as QueryRunner;
    this.resetQr();
  }
  createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
    return this.qr;
  }
  resetQr(): void {
    Object.assign(this.qr.manager, {
      save: jest.fn(),
    });
    this.qr.connect = jest.fn();
    this.qr.release = jest.fn();
    this.qr.startTransaction = jest.fn();
    this.qr.commitTransaction = jest.fn();
    this.qr.rollbackTransaction = jest.fn();
    this.qr.release = jest.fn();
  }
}
