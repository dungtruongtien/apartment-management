import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"
import { Booking } from "../booking/booking.entity"

@Entity()
export class Customer {
    @PrimaryGeneratedColumn({ name: 'customer_id' })
    public customerID: string

    @Column({ name: 'customer_name', type: 'varchar', length: 120 })
    public customerName: string

    @OneToMany(() => Booking, (booking) => booking.customer)
    @JoinColumn({ name: "customer_id" })
    bookings: Booking[];
}