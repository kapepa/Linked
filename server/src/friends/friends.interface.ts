import {UsersInterface} from "../users/users.interface";

export class FriendsInterface {
  id?: string;
  user?: UsersInterface;
  friends?: UsersInterface;
  status?: string;
  created_at?: Date;
}