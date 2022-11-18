import { UserInterface } from "./user.interface";
import { ChatInterface } from "./chat.interface";
import { StatusEnum } from "../enum/status.enum";

export class MessageInterface {
  id?: string;
  owner?: UserInterface;
  chat?: ChatInterface;
  status?: StatusEnum;
  message?: string;
}
