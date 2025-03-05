import { Test, TestingModule } from '@nestjs/testing';
import { SubrolesService } from './subroles.service';

describe('SubrolesService', () => {
  let service: SubrolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubrolesService],
    }).compile();

    service = module.get<SubrolesService>(SubrolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
