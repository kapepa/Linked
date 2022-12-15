import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Feet} from "./feet.entity";
import {User} from "../users/users.entity";

@Entity()
export class CommentEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.comment)
  host: User;

  @ManyToOne(() => Feet, (feet) => feet.comments)
  feet: Feet;

  @Column()
  comment?: string;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;
}