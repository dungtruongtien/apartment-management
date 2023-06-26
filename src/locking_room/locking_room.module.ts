import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockingRoomService } from './locking_room.service';
import { LockingRoomController } from './locking_room.controller';
import { LockingRoom } from './locking_room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LockingRoom])],
  providers: [LockingRoomService],
  controllers: [LockingRoomController],
  exports: [LockingRoomService]

})
export class LockingRoomModule {}
