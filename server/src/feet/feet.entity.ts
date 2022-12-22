import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import {User} from "../users/users.entity";
import {CommentEntity} from "./comment.entity";

@Entity()
export class Feet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  img: string;

  @Column()
  video?: string;

  @Column()
  file?: string;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.feet)
  author: User;

  @ManyToMany(() => User, (user) => user.my_like)
  like: User[];

  @Column({ default: 0 })
  like_count: number

  @OneToMany(() => CommentEntity, (comment) => comment.feet)
  comments: CommentEntity[];

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;
}
