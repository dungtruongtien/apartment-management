import { Controller, Get } from '@nestjs/common';
import { RaceConditionLockingService } from './race_condition_locking.service';
import { RaceConditionLocking } from './race_condition_locking.entity';

@Controller('room')
export class RaceConditionLockingController {
  constructor(private readonly raceConditionLockingService: RaceConditionLockingService) {}

  @Get()
  async findAll(): Promise<RaceConditionLocking[]> {
    return this.raceConditionLockingService.findAll();
  }
}
