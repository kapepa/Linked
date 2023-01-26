import { UsersInterface } from "../users/users.interface";
import { ChatInterface } from "./chat.interface";
import { MessageStatus } from "./status.enum";

export class MessageInterface {
  id?: string;
  owner?: UsersInterface;
  chat?: ChatInterface;
  message?: string;
  status?: MessageStatus;
  created_at?: Date;
}