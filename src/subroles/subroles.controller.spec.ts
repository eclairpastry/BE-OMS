import { Test, TestingModule } from '@nestjs/testing';
import { SubrolesController } from './subroles.controller';

describe('SubrolesController', () => {
  let controller: SubrolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubrolesController],
    }).compile();

    controller = module.get<SubrolesController>(SubrolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
