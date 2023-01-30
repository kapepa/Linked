import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn} from 'typeorm';
import {NewsInterface} from "./news.interface";
import {User} from "../users/users.entity";

@Entity()
export class NewsEntity implements NewsInterface{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.news)
  author: User

  @Column()
  title: string;

  @Column()
  img: string;

  @Column()
  content: string;

  @CreateDateColumn({  name: 'created_at' })
  created_at: Date;
}