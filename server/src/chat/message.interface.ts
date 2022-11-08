import {UsersInterface} from "../users/users.interface";

export class MessageInterface {
  id?: string;
  owner?: UsersInterface;
  message?: string;
}