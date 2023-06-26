import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { BookingDto, CheckBookingDto } from './booking.dto';

@Injectable()
export class CreateBookingValidation implements PipeTransform {
  transform(value: BookingDto, metadata: ArgumentMetadata) {
    if (!value.customerID) {
      throw new BadRequestException('Customer ID is required');
    }
    if (isNaN(value.customerID)) {
      throw new BadRequestException('Customer ID must be a number');
    }
    if (!value.bookingInfos) {
      throw new BadRequestException('Booking Infos is required');
    }
    for (let i = 0; i < value.bookingInfos.length; i++) {
      if (!value.bookingInfos[i].roomID) {
        throw new BadRequestException('Booking Info RoomID is required');
      }
      if (!value.bookingInfos[i].checkinDate) {
        throw new BadRequestException('Booking Info Checkin date is required');
      }
      if (!value.bookingInfos[i].checkoutDate) {
        throw new BadRequestException('Booking Info Checkout date is required');
      }
      if (isNaN(value.bookingInfos[i].roomID)) {
        throw new BadRequestException('Booking Room ID is invalid');
      }
      if (typeof value.bookingInfos[i].checkinDate !==  "string") {
        throw new BadRequestException('Booking Info Checkin date is invalidssss');
      }
      if (typeof value.bookingInfos[i].checkoutDate !==  "string") {
        throw new BadRequestException('Booking Info Checkout date is invalid');
      }
      const checkinDate = new Date(value.bookingInfos[i].checkinDate);
      if (!(checkinDate instanceof Date || !isNaN(checkinDate))) {
        throw new BadRequestException('Booking Info Checkin date is invalid');
      }
      const nowTimestamp = new Date().getTime()
      const checkinDateTimestamp = checkinDate.getTime()
      if(checkinDateTimestamp <= nowTimestamp) {
        throw new BadRequestException('Booking Info Checkin date must be greater than now');
      }
      const checkoutDate = new Date(value.bookingInfos[i].checkoutDate);
      if (!(checkoutDate instanceof Date || !isNaN(checkoutDate))) {
        throw new BadRequestException('Booking Info Checkin date is invalid');
      }
      const checkoutDateTimestamp = checkoutDate.getTime()
      if(checkoutDateTimestamp <= checkinDateTimestamp) {
        throw new BadRequestException('Booking Info Checkout date must be greater than Checkin date');
      }
    }
    return value;
  }
}


export class CheckBookingValidationPipe implements PipeTransform {
  transform(value: CheckBookingDto, metadata: ArgumentMetadata) {
      if (!value.checkinDate) {
        throw new BadRequestException('Booking Info Checkin date is required');
      }
      if (!value.checkoutDate) {
        throw new BadRequestException('Booking Info Checkout date is required');
      }
      if (typeof value.checkinDate !==  "string") {
        throw new BadRequestException('Booking Info Checkin date is invalidssss');
      }
      if (typeof value.checkoutDate !==  "string") {
        throw new BadRequestException('Booking Info Checkout date is invalid');
      }
      const checkinDate = new Date(value.checkinDate);
      if (!(checkinDate instanceof Date || !isNaN(checkinDate))) {
        throw new BadRequestException('Booking Info Checkin date is invalid');
      }
      const nowTimestamp = new Date().getTime()
      const checkinDateTimestamp = checkinDate.getTime()
      if(checkinDateTimestamp <= nowTimestamp) {
        throw new BadRequestException('Booking Info Checkin date must be greater than now');
      }
      const checkoutDate = new Date(value.checkoutDate);
      if (!(checkoutDate instanceof Date || !isNaN(checkoutDate))) {
        throw new BadRequestException('Booking Info Checkin date is invalid');
      }
      const checkoutDateTimestamp = checkoutDate.getTime()
      if(checkoutDateTimestamp <= checkinDateTimestamp) {
        throw new BadRequestException('Booking Info Checkout date must be greater than Checkin date');
      }
    return value;
  }
}
