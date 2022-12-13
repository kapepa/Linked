import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
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

  @ManyToMany(() => User, (user) => user.my_like)
  like: User[];

  @Column({ default: 0 })
  like_count: number

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;
}
