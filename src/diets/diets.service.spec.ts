import { Test, TestingModule } from '@nestjs/testing';
import { DietsService } from './diets.service';

describe('DietService', () => {
  let service: DietsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietsService],
    }).compile();

    service = module.get<DietsService>(DietsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
