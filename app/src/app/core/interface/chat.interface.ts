import {MessageInterface} from "./message.interface";
import {UserInterface} from "./user.interface";

export class ChatInterface {
  id?: string;
  conversation?: UserInterface[];
  chat?: MessageInterface[];
  updated_at?: Date;
}
