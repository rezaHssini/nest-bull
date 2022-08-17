import { QueryBuilderMock } from './query-builder.mock';

export class RepositoryMock {
  private lastIndex = 0;
  constructor(private idKey = 'id') {}
  create<T = any>(obj): T {
    obj[this.idKey] = ++this.lastIndex;
    return obj;
  }

  createMany<T = any>(obj): T {
    return obj;
  }
  findOne(...args): Promise<any> {
    return null;
  }

  save<T = any>(obj): T {
    return obj;
  }
  createQueryBuilder(): QueryBuilderMock {
    return new QueryBuilderMock();
  }
  async update(): Promise<any> {
    return {};
  }
  async find(): Promise<any[]> {
    return [];
  }
  async createOrUpdate<T = any>(arg: any): Promise<T> {
    return arg;
  }
  async delete(arg: any): Promise<any> {}
  async count(arg: any): Promise<any> {}
}
