import { Body, Controller, Get, HttpStatus, Post, Res, UsePipes } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './booking.entity';
import { BookingDto, BookingInfoResp, CheckBookingDto } from './booking.dto';
import { Response } from 'express';
import { CreateBookingValidation, CheckBookingValidationPipe } from './booking.validation';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService
  ) { }

  @Get('check-available')
  @UsePipes(new CheckBookingValidationPipe())
  async findAll(@Res() res: Response, @Body() checkBookingInput: CheckBookingDto) {
    const resp: BookingInfoResp = {
      data: null,
      message: '',
      errorCode: '',
      statusCode: HttpStatus.OK
    }
    let limit = checkBookingInput.limit || 10;
    let offset = checkBookingInput.offset || 0;
    // Todo: Learn more about typeorm to use typeorm to build query
    const queryString = `
    select distinct(r.*)
    from public.room r 
    left join locking_room lr 
    on r.room_id = lr.room_id
    where lr.room_id is null
    or lr.room_id NOT IN (
      SELECT lr2.room_id
      FROM public.locking_room lr2
      WHERE (lr2.checkin_date <= '${checkBookingInput.checkinDate}' AND lr2.checkout_date >= '${checkBookingInput.checkoutDate}')
            OR (lr2.checkin_date <= '${checkBookingInput.checkinDate}' AND lr2.checkout_date >= '${checkBookingInput.checkinDate}')
            OR (lr2.checkin_date <= '${checkBookingInput.checkoutDate}' AND lr2.checkout_date >= '${checkBookingInput.checkoutDate}')
            OR (lr2.checkin_date >= '${checkBookingInput.checkinDate}' AND lr2.checkout_date <= '${checkBookingInput.checkoutDate}')
    )
    limit ${limit}
    offset ${offset}
    `
    let data = await this.bookingService.checkAllAvailableRoom(queryString);
    resp.data = data
    res.status(res.statusCode).json(resp);
  }

  @Post()
  @UsePipes(new CreateBookingValidation())
  async booking(@Res() res: Response, @Body() createBookingDto: BookingDto) {
    const bookingResp: BookingInfoResp = await this.bookingService.booking(createBookingDto);
    res.status(bookingResp.statusCode).json(bookingResp);
  }
}
