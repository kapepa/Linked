import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {User} from "../users/users.entity";
import {TypeEnum} from "./type.enum";
import {EventInterface} from "./event.interface";

@Entity()
export class EventEntity implements EventInterface{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne( () => User, (user) => user.event )
  user: User;

  @Column()
  img: string;

  @Column()
  link: string;

  @Column()
  time: string;

  @Column()
  title: string

  @Column({ type: "enum", enum: TypeEnum, default: TypeEnum.Online })
  type: TypeEnum;

  @Column()
  description: string
}