import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany, OneToOne, JoinColumn,
} from 'typeorm';
import {User} from "../users/users.entity";
import {CommentEntity} from "./comment.entity";
import {AccessEnum} from "./access.enum";
import {AdditionEntity} from "./addition.entity";


@Entity()
export class Feet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  img: string;

  @Column({ default: '' })
  video?: string;

  @Column({ default: '' })
  file?: string;

  @Column()
  body: string;

  @Column( {
    type: "enum",
    enum: AccessEnum,
    default: AccessEnum.ANYONE
  } )
  access: AccessEnum

  @OneToOne(() => AdditionEntity, (addition) => addition.post)
  @JoinColumn()
  addition: AdditionEntity

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
