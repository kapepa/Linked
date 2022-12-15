import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from "../users/users.entity";
import { Chat } from "./chat.entity";
import { MessageStatus } from "./status.enum";

@Entity()
export class MessageEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.messages)
  owner: User;

  @ManyToOne(() => Chat, (chat) => chat.chat)
  chat: Chat

  @Column()
  message: string;

  @Column({
    type: "enum",
    enum: MessageStatus,
    enumName: "enum_status_message",
    default: MessageStatus.WAITING,
  })
  status: MessageStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}