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

  @Column({ type: 'simple-array', nullable: true, default: [] })
  img: string[];

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

  @OneToOne(() => AdditionEntity, (addition) => addition.post, { onDelete: 'CASCADE' })
  @JoinColumn()
  addition: AdditionEntity

  @ManyToOne(() => User, (user) => user.feet, { onDelete: 'CASCADE' })
  author: User;

  @ManyToMany(() => User, (user) => user.my_like, { onDelete: 'CASCADE' })
  like: User[];

  @Column({ default: 0 })
  like_count: number

  @OneToMany(() => CommentEntity, (comment) => comment.feet, { onDelete: 'CASCADE' })
  comments: CommentEntity[];

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;
}
