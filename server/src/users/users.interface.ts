import { Role } from "../auth/role.enum";
import { FeetInterface } from "../feet/feet.interface";
import { FriendsInterface } from "../friends/friends.interface";
import { ChatInterface } from "../chat/chat.interface";
import { MessageInterface } from "../chat/message.interface";
import { CommentInterface } from "../feet/comment.interface";
import { EventInterface } from "../event/event.interface";
import { NewsInterface } from "../news/news.interface";

export class UsersInterface {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  request?: FriendsInterface[];
  suggest?: FriendsInterface[];
  friends?: UsersInterface[];
  comments?: CommentInterface[];
  role?: Role;
  feet?: FeetInterface[];
  chat?: ChatInterface[];
  messages?: MessageInterface[]
  my_like?: FeetInterface[]
  comment?: CommentInterface[]
  event?: EventInterface[]
  news?: NewsInterface[]
  created_at?: Date;
}