import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueueManagerService } from '../queue-manager/queue-manager.service';
import { QueueManagerServiceMock } from '../queue-manager/testing-mocks/queue-manager/queue-manager-service.mock';
import { TypeormConnection } from '../global-module/services/typeorm-connection';
import { LockedJobs } from '../entities/locked-jobs';
import { GlobalServicesModule } from '../global-module/global-services.module';
import { TypeormConnectionMock } from '../testing-mocks/database-connection/Database-connection-manager.mock';
import { RepositoryMock } from '../testing-mocks/db/repository.mock';
import { JobLockerService } from './job-locker.service';

describe('JobLockerService', () => {
  let service: JobLockerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GlobalServicesModule.register(
          [{ provide: TypeormConnection, useClass: TypeormConnectionMock }],
          [],
        ),
      ],
      providers: [
        JobLockerService,
        { provide: getRepositoryToken(LockedJobs), useClass: RepositoryMock },
        { provide: QueueManagerService, useClass: QueueManagerServiceMock },
      ],
    }).compile();

    service = module.get<JobLockerService>(JobLockerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call unlock', async () => {
    const spy = jest.spyOn(RepositoryMock.prototype, 'delete');
    await service.unlock('test', 'test', 'test');
    expect(spy).toBeCalledWith({
      key: 'UNIQUE_KEY-test-test',
      lockId: 'test',
    });
  });
});
