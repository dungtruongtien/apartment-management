import { Module } from '@nestjs/common';
import { LockingRoomModule } from '../locking_room/locking_room.module';
import { CronService } from './cron.service';

@Module({
  imports: [LockingRoomModule],
  providers: [CronService]
})
export class CronModule {}
