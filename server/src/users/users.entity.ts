import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Feet } from "../feet/feet.entity";
import { Role } from "../auth/role.enum";
import { FriendsEntity } from "../friends/friends.entity";
import { Chat } from "../chat/chat.entity";
import { MessageEntity } from "../chat/message.entity";
import { CommentEntity } from "../feet/comment.entity";
import { UsersInterface } from "./users.interface";

@Entity()
export class User implements UsersInterface{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  avatar: string;

  @OneToMany(() => FriendsEntity, (friendsRequest) => friendsRequest.user)
  request: FriendsEntity[];

  @OneToMany(() => FriendsEntity, (friendsRequest) => friendsRequest.friends)
  suggest: FriendsEntity[];

  @ManyToMany(() => User,{cascade: true})
  @JoinTable({ name: 'user-friends' })
  friends: User[]

  @Column({ type: "enum", enum: Role, default: Role.User})
  role: Role;

  @OneToMany(() => Feet, (feet) => feet.author)
  feet: Feet[];

  @ManyToMany(() => Chat, (chat) => chat.conversation)
  chat: Chat[];

  @ManyToMany(() => Feet, (feet) => feet.like)
  @JoinTable({ name: 'feet-like' })
  my_like: Feet[];

  @OneToMany(() => CommentEntity, (comment) => comment.host)
  comment: CommentEntity[]

  @OneToMany(() => MessageEntity, (message) => message.owner)
  messages: MessageEntity[];

  @CreateDateColumn({ select: false, name: 'created_at'})
  created_at: Date;
}