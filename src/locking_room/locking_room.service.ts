import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions, InsertResult, ObjectLiteral, Repository } from 'typeorm';
import { LockingRoom } from './locking_room.entity';
import { LockingRoomDto } from './locking_booking.dto';
import { Booking } from '../booking/booking.entity';

@Injectable()
export class LockingRoomService {
  constructor(
    @InjectRepository(LockingRoom)
    private readonly lockingRoomRepository: Repository<LockingRoom>,
  ) { }

  async find(): Promise<LockingRoom[]> {
    return this.lockingRoomRepository.find();
  }

  async remove(whereStr: string, parameter: ObjectLiteral): Promise<DeleteResult> {
    return this.lockingRoomRepository.createQueryBuilder()
    .delete()
    .from(LockingRoom)
    .where(whereStr, parameter)
    .execute();
  }

  async findOne(option: FindOneOptions<LockingRoom>): Promise<LockingRoom> {
    return this.lockingRoomRepository.findOne(option);
  }

  async createMany(createLockingRoomsDto: LockingRoomDto[]): Promise<InsertResult> {
    return this.lockingRoomRepository.insert(createLockingRoomsDto);
  }

  async checkExistOneLockingRoom(queryStr: string): Promise<LockingRoom[]> {
    return this.lockingRoomRepository.query(queryStr)
  }
}
