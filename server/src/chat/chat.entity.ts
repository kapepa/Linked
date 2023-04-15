import { Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany, UpdateDateColumn, JoinTable } from 'typeorm';
import { User } from "../users/users.entity";
import { MessageEntity } from "./message.entity";

@Entity()
export class Chat{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, (user) => user.chat, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'chat_user' })
  conversation: User[];

  @OneToMany(() => MessageEntity, (message) => message.chat, { onDelete: 'CASCADE' })
  chat: MessageEntity[];

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}