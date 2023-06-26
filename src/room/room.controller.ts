import { Controller, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }
}
