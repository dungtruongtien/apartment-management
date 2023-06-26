import * as Joi from 'joi';
import { LockingRoom } from "../locking_room/locking_room.entity";
import { Booking } from "./booking.entity";


export class BookingDto {
  customerID: number;
  bookingInfos: BookingInfo[];
}

export class CheckBookingDto {
  checkinDate: Date;
  checkoutDate: Date;
  limit: number;
  offset: number;
}

export class BookingInfo {
  roomID: number;
  checkinDate: Date;
  checkoutDate: Date;
}

export class BookingInfoResp {
  statusCode: number;
  message: string;
  errorCode: string;
  data: Booking[] | Booking | LockingRoom
}