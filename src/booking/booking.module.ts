import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './booking.entity';
import { RaceConditionLockingModule } from '../race_condition_locking/race_condition_locking.module';
import { LockingRoomModule } from '../locking_room/locking_room.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), RaceConditionLockingModule, LockingRoomModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule { }
