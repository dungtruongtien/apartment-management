import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LockingRoomService } from '../locking_room/locking_room.service';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  @Inject()
  private readonly lockingRoomService: LockingRoomService

  // Run every 23:00 from Monday to Sunday
  @Cron('0 0 23 * * 0-6')
  // @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    const now = new Date()
    // Todolist: Handle error, retry for this
    let whereStr: string = 'checkout_date < :now'
    let parameter: ObjectLiteral = { now }
    this.lockingRoomService.remove(whereStr, parameter)
    this.logger.debug('Schedule to handle delete unused booking info');
  }
}