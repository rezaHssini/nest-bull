import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class TypeormConnection {
  constructor(private readonly connection: Connection) {}
  getConnection(): Connection {
    return this.connection;
  }
}
