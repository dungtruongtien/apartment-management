import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/customer.entity';
import { RoomModule } from './room/room.module';
import { Room } from './room/room.entity';
import { Booking } from './booking/booking.entity';
import { BookingModule } from './booking/booking.module';
import { LockingRoomModule } from './locking_room/locking_room.module';
import { LockingRoom } from './locking_room/locking_room.entity';
import { RaceConditionLockingModule } from './race_condition_locking/race_condition_locking.module';
import { RaceConditionLocking } from './race_condition_locking/race_condition_locking.entity';
import { CronModule } from './cron/cron.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [Customer, Room, Booking, LockingRoom, RaceConditionLocking],
      synchronize: true,
      logging: true
    }),
    CustomerModule,
    RoomModule,
    BookingModule,
    LockingRoomModule,
    RaceConditionLockingModule,
    CronModule,
  ],
})
export class AppModule {}
