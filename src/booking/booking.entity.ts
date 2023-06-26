import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Customer } from "../customer/customer.entity";
import { Room } from "../room/room.entity";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn({ name: 'booking_id' })
    public bookingID?: number

    @Column({ name: 'room_id', type: 'int' })
    public roomID: number

    @Column({ name: 'customer_id', type: 'int' })
    public customerID: number

    @Column({ name: 'checkin_date', type: 'timestamptz' })
    checkinDate: Date;

    @Column({ name: 'checkout_date', type: 'timestamptz' })
    checkoutDate: Date;

    @ManyToOne(() => Room, (room: Room) => room.bookings)
    @JoinColumn({ name: "room_id" })
    room?: Room;

    @ManyToOne(() => Customer, (customer: Customer) => customer.bookings)
    @JoinColumn({ name: "customer_id" })
    customer?: Customer;

}