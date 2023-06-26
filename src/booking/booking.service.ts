import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { BookingDto, BookingInfo, BookingInfoResp } from './booking.dto';
import { RaceConditionLockingDto } from '../race_condition_locking/race_condition_locking.dto'
import { RaceConditionLockingService } from '../race_condition_locking/race_condition_locking.service';
import { LockingRoomService } from '../locking_room/locking_room.service';
import { LockingRoom } from '../locking_room/locking_room.entity';
import { LockingRoomDto } from '../locking_room/locking_booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly raceConditionLockingService: RaceConditionLockingService,
    private readonly lockingRoomService: LockingRoomService
  ) { }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async __handleLockBookingTemporarily(createRaceConditionLockingDto: RaceConditionLockingDto[]): Promise<BookingInfoResp> {
    const resp: BookingInfoResp = {
      data: null,
      message: '',
      errorCode: '',
      statusCode: HttpStatus.OK
    }
    try {
      await this.raceConditionLockingService.createMany(createRaceConditionLockingDto)
      resp.statusCode = HttpStatus.OK
    } catch (err) {
      // Todolist: Handle TTL for race locking
      this.raceConditionLockingService.remove(createRaceConditionLockingDto)
      // If one of them is locked, reject all customer's booking
      resp.errorCode = "ROOM_IS_LOCKED_FOR_BOOKING"
      resp.message = "Room is locked for another customer's booking"
      resp.statusCode = HttpStatus.CONFLICT
    }
    return resp;
  }

  async booking(@Body() createBookingDto: BookingDto): Promise<BookingInfoResp> {
    const resp: BookingInfoResp = {
      data: null,
      message: '',
      errorCode: '',
      statusCode: HttpStatus.OK
    }
    // Handle to lock room temporarily
    const createRaceConditionLockingDto: RaceConditionLockingDto[] = []
    createBookingDto.bookingInfos.forEach(((bookingInfo: BookingInfo) => {
      createRaceConditionLockingDto.push({ lockingRoomID: bookingInfo.roomID })
    }))
    
    // Handle race condition => Lock room temporarily for each user's booking room
    let lockBookingTemporarilyResp = await this.__handleLockBookingTemporarily(createRaceConditionLockingDto)
    if(lockBookingTemporarilyResp.statusCode == HttpStatus.CONFLICT) {
      return lockBookingTemporarilyResp
    }


    const lockingRoomsArr: LockingRoom[] = []
    const bookingsArr: Booking[] = []
    // Handle data for storage booking infos
    createBookingDto.bookingInfos.forEach((bookingInfo: BookingInfo) => {
      const lockingRoom: LockingRoom = {
        roomID: bookingInfo.roomID,
        checkinDate: bookingInfo.checkinDate,
        checkoutDate: bookingInfo.checkoutDate,
      }
      const booking: Booking = {
        customerID: createBookingDto.customerID,
        checkinDate: bookingInfo.checkinDate,
        roomID: bookingInfo.roomID,
        checkoutDate: bookingInfo.checkoutDate,
      }
      bookingsArr.push(booking)
      lockingRoomsArr.push(lockingRoom)
    });

    // Check room is booked
    for (let i = 0 ; i < createBookingDto.bookingInfos.length; i++) {
      const bookingInfo = createBookingDto.bookingInfos[0]
      const queryStr = `
      SELECT lr.room_id
      FROM public.locking_room lr
      WHERE (lr.checkin_date <= '${bookingInfo.checkinDate}' AND lr.checkout_date >= '${bookingInfo.checkoutDate}')
            OR (lr.checkin_date <= '${bookingInfo.checkinDate}' AND lr.checkout_date >= '${bookingInfo.checkinDate}')
            OR (lr.checkin_date <= '${bookingInfo.checkoutDate}' AND lr.checkout_date >= '${bookingInfo.checkoutDate}')
            OR (lr.checkin_date >= '${bookingInfo.checkinDate}' AND lr.checkout_date <= '${bookingInfo.checkoutDate}')
    limit 1
    offset 0
    `
      const isExistRoomBooked = await this.lockingRoomService.checkExistOneLockingRoom(queryStr);
      if (isExistRoomBooked.length > 0) {
        // Todolist: Handle TTL for race locking
        this.raceConditionLockingService.remove(createRaceConditionLockingDto); // Release locking key
        // If one of them is locked, reject all customer's booking
        resp.data = isExistRoomBooked[0];
        resp.errorCode = "ROOM_IS_LOCKED_FOR_BOOKING";
        resp.message = "Room is locked for another customer's booking";
        resp.statusCode = HttpStatus.CONFLICT;
        return resp;
      }
    }

    // If all of rooms is available => Booking succeed
    // Create locking for this room, cronjob will remove this lock when now > checkout_date
    const lockingRoomServiceCreateResp = await this.lockingRoomService.createMany(lockingRoomsArr);
    const bookingServiceCreateResp = await this.bookingRepository.insert(bookingsArr);
    await this.raceConditionLockingService.remove(createRaceConditionLockingDto); // Release locking key
    // Todo: Handle error carefully, handle for each case
    if (lockingRoomServiceCreateResp && bookingServiceCreateResp) {
      resp.data = lockingRoomServiceCreateResp.raw;
      return resp;
    }
    resp.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    return resp;
  }

  async checkAllAvailableRoom(query: string): Promise<Booking[]> {
    return this.bookingRepository.query(query)
  }
}
