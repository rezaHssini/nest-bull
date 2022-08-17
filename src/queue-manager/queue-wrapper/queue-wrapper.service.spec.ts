import { Test, TestingModule } from '@nestjs/testing';
import { QueueManagerServiceMock } from '../testing-mocks/queue-manager/queue-manager-service.mock';
import { QueueManagerService } from '../queue-manager.service';
import { QueueWrapperService } from './queue-wrapper.service';

describe('QueueWrapperService', () => {
  let service: QueueWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueWrapperService,
        { provide: QueueManagerService, useClass: QueueManagerServiceMock },
      ],
    }).compile();

    service = module.get<QueueWrapperService>(QueueWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
