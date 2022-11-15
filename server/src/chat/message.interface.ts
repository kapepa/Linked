import {UsersInterface} from "../users/users.interface";

export enum MessageStatus {
  reading = 'reading',
  waiting = 'waiting',
}

export class MessageInterface {
  id?: string;
  owner?: UsersInterface;
  message?: string;
  status?: MessageStatus;
}