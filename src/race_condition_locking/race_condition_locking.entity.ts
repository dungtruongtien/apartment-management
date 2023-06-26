import { Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class RaceConditionLocking {
    @PrimaryGeneratedColumn({name: "locking_room_id"})
    public lockingRoomID: number
}