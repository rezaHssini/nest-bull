import { ConnectionMock } from '../db/connection';

export class TypeormConnectionMock {
  connection: ConnectionMock;
  constructor() {
    this.connection = new ConnectionMock();
  }
  getConnection(): any {
    return { manager: { transaction: jest.fn() } };
  }
}
