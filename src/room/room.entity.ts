import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"
import { Booking } from "../booking/booking.entity"
import { LockingRoom } from "../locking_room/locking_room.entity"

@Entity()
export class Room {
    @PrimaryGeneratedColumn({ name: 'room_id' })
    public roomID: number

    @Column({ name: 'room_name', type: 'varchar', length: 120 })
    public roomName: string

    @Column({ name: 'address', type: 'varchar', length: 120 })
    public address: string

    @Column({ name: 'description', type: 'varchar', length: 120 })
    public description: string

    @OneToMany(() => Booking, (booking) => booking.room)
    @JoinColumn({ name: "room_id" })
    bookings: Booking[];

    @OneToMany(() => LockingRoom, (lockingRoom) => lockingRoom.room)
    @JoinColumn({ name: "room_id" })
    lockingRooms: LockingRoom[];

}