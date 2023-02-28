import {UserClass} from "./user-class";
import {MessageClass} from "./message-class";
import {MessageInterface} from "../app/core/interface/message.interface";
import {UserInterface} from "../app/core/interface/user.interface";

export const ChatClass = {
  id: "chatID",
  conversation: [UserClass],
  chat: [MessageClass] as MessageInterface,
}
