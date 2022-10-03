import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from 'typeorm';
import {FeetInterface} from "./feet.interface";
import {User} from "../users/users.entity";

@Entity()
export class Feet implements FeetInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.feet)
  author: User;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;
}
