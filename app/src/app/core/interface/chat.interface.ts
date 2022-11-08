import {UserInterface} from "./user.interface";

export class MessageInterface {
  id?: string;
  owner?: UserInterface;
  message?: string;
}

export class ChatInterface {
  id: string;
  chat: MessageInterface[];
}
