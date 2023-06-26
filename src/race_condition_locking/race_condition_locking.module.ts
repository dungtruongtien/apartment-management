import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceConditionLockingService } from './race_condition_locking.service';
import { RaceConditionLockingController } from './race_condition_locking.controller';
import { RaceConditionLocking } from './race_condition_locking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RaceConditionLocking])],
  providers: [RaceConditionLockingService],
  controllers: [RaceConditionLockingController],
  exports: [RaceConditionLockingService]
})
export class RaceConditionLockingModule {}
