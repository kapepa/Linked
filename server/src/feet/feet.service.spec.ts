import { Test, TestingModule } from '@nestjs/testing';
import { FeetService } from './feet.service';

describe('FeetService', () => {
  let service: FeetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeetService],
    }).compile();

    service = module.get<FeetService>(FeetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
