import {UserClass} from "./user.class";

const ChatClass = {
  id: 'chatID',
  conversation: [UserClass],
  chat: [],
  updated_at: new Date(Date.now()),
}

const MessageClass = {
  id: 'messageID',
  owner: UserClass,
  chat: ChatClass,
  message: 'message',
  status: 'waiting',
  created_at: new Date(Date.now()),
}

// Object.defineProperty(ChatClass, 'chat', { value: [MessageClass] })

export {ChatClass, MessageClass}