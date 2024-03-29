import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {User} from "../users/users.entity";
import {TypeEnum} from "./type.enum";
import {EventInterface} from "./event.interface";

@Entity()
export class EventEntity implements EventInterface{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne( () => User, (user) => user.event, { onDelete: 'CASCADE' } )
  user: User;

  @Column({ type: 'date', default: () => 'NOW()', })
  date: Date

  @Column({ default: '' })
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