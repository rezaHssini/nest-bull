export class QueryBuilderMock {
  select(): QueryBuilderMock {
    return this;
  }
  offset(): QueryBuilderMock {
    return this;
  }
  limit(): QueryBuilderMock {
    return this;
  }
  setLock(): QueryBuilderMock {
    return this;
  }
  where(): QueryBuilderMock {
    return this;
  }
  andWhere(): QueryBuilderMock {
    return this;
  }
  orderBy(): QueryBuilderMock {
    return this;
  }
  groupBy(): QueryBuilderMock {
    return this;
  }
  async getOne(): Promise<object | null> {
    return {};
  }
  async getRawMany(): Promise<object[]> {
    return [];
  }
}
