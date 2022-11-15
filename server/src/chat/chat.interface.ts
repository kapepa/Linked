import { MessageInterface } from "./message.interface";
import {UsersInterface} from "../users/users.interface";

export class ChatInterface {
  id?: string;
  conversation?: UsersInterface[];
  chat?: MessageInterface[];
  updated_at?: Date;
}