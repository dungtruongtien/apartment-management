import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { RaceConditionLocking } from './race_condition_locking.entity';
import { RaceConditionLockingDto } from './race_condition_locking.dto';

@Injectable()
export class RaceConditionLockingService {
  constructor(
    @InjectRepository(RaceConditionLocking)
    private readonly raceConditionLockingRepository: Repository<RaceConditionLocking>,
  ) {}

  async findAll(): Promise<RaceConditionLocking[]> {
    return this.raceConditionLockingRepository.find();
  }

  async insert(createRaceConditionLockingDto: RaceConditionLockingDto): Promise<InsertResult> {
    return this.raceConditionLockingRepository.insert({...createRaceConditionLockingDto});
  }

  async createMany(createRaceConditionLockingsDto: RaceConditionLockingDto[]): Promise<InsertResult> {
    return this.raceConditionLockingRepository.insert(createRaceConditionLockingsDto);
  }

  // async remove(lockingRoomIDs: number[]): Promise<DeleteResult> {
  //   return this.raceConditionLockingRepository.createQueryBuilder()
  //   .delete()
  //   .from(RaceConditionLocking)
  //   .where('locking_room_id IN (:...lockingRoomIDs)', { lockingRoomIDs })
  //   .execute();
  // }

  async remove(createRaceConditionLockingsDto: RaceConditionLockingDto[]): Promise<RaceConditionLocking[]> {
    return this.raceConditionLockingRepository.remove(createRaceConditionLockingsDto);
  }
}
