import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Feet} from "./feet.entity";
import {User} from "../users/users.entity";

@Entity()
export class CommentEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  host: User;

  @ManyToOne(() => Feet, (feet) => feet.comments, { onDelete: 'CASCADE' })
  feet: Feet;

  @Column()
  comment?: string;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;
}