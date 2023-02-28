import {ChatInterface} from "../app/core/interface/chat.interface";
import {UserClass} from "./user-class";

export const MessageClass = {
  id: "messageID",
  owner: UserClass,
  chat: ChatInterface,
  status: 'reading',
  message: 'Message',
} as any
