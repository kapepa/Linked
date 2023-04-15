import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
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
import { EventEntity } from "../event/event.entity";
import { NewsEntity } from "../news/news.entity";

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

  @Column({ select: false, default: ''})
  password: string;

  @Column({ default: '' })
  avatar: string;

  @OneToMany(() => FriendsEntity, (friendsRequest) => friendsRequest.user, { onDelete: 'CASCADE' })
  request: FriendsEntity[];

  @OneToMany(() => FriendsEntity, (friendsRequest) => friendsRequest.friends, { onDelete: 'CASCADE' })
  suggest: FriendsEntity[];

  @ManyToMany(() => User,{cascade: true})
  @JoinTable({ name: 'user-friends' })
  friends: User[]

  @Column({ type: "enum", enum: Role, default: Role.User})
  role: Role;

  @OneToMany(() => Feet, (feet) => feet.author, { onDelete: 'CASCADE' })
  feet: Feet[];

  @ManyToMany(() => Chat, (chat) => chat.conversation, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  chat: Chat[];

  @ManyToMany(() => Feet, (feet) => feet.like, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'feet-like' })
  my_like: Feet[];

  @OneToMany(() => CommentEntity, (comment) => comment.host, { onDelete: 'CASCADE' })
  comment: CommentEntity[]

  @OneToMany(() => MessageEntity, (message) => message.owner, { onDelete: 'CASCADE' })
  messages: MessageEntity[];

  @OneToMany(() => EventEntity, (event) => event.user, { onDelete: 'CASCADE' })
  event: EventEntity[];

  @OneToMany(() => NewsEntity, (news) => news.author, { onDelete: 'CASCADE' })
  news: NewsEntity[];

  @CreateDateColumn({ select: false, name: 'created_at'})
  created_at: Date;
}