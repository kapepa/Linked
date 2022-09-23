import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';
import {FeetInterface} from "./feet.interface";

@Entity()
export class Feet implements FeetInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  body: string;

  // @Column()
  // author?: object;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;
}
