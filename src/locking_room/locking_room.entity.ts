import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm"
import { Room } from "../room/room.entity";

@Entity()
export class LockingRoom {
    @PrimaryGeneratedColumn({ name: 'locking_room_id' })
    public locking_room_id?: number

    @Column({ name: 'room_id' })
    public roomID: number

    @Column({ name: 'checkin_date', type: 'timestamptz' })
    checkinDate: Date;

    @Column({ name: 'checkout_date', type: 'timestamptz' })
    checkoutDate: Date;

    @ManyToOne(() => Room, (room: Room) => room.lockingRooms)
    @JoinColumn({ name: "room_id" })
    room?: Room;
}