import { Controller, Get } from '@nestjs/common';
import { LockingRoomService } from './locking_room.service';
import { LockingRoom } from './locking_room.entity';
import { FindOneOptions } from 'typeorm';

@Controller('room')
export class LockingRoomController {
  constructor(private readonly lockingRoomService: LockingRoomService) {}

  @Get()
  async findOne(option: FindOneOptions<LockingRoom>): Promise<LockingRoom> {
    return this.lockingRoomService.findOne(option);
  }
}
