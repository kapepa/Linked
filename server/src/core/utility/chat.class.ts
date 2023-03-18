import {UserClass} from "./user.class";

class Mock {
  private chat = {
    id: 'chatID',
    conversation: [UserClass],
    chat: [],
    updated_at: new Date(Date.now()),
  };

  private message = {
    id: 'messageID',
    owner: UserClass,
    chat: this.chat,
    message: 'message',
    status: 'waiting',
    created_at: new Date(Date.now()),
  }

  get getChat() {
    return {...this.chat, chat: [this.message]}
  }

  get getMessage() {
    return this.message;
  }
}

const mock = new Mock();
const ChatClass = mock.getChat;
const MessageClass = mock.getMessage;

export {ChatClass, MessageClass}