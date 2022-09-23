import { Test, TestingModule } from '@nestjs/testing';
import { FeetController } from './feet.controller';

describe('FeetController', () => {
  let controller: FeetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeetController],
    }).compile();

    controller = module.get<FeetController>(FeetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
