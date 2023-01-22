import {UsersInterface} from "../users/users.interface";
import {Status} from "./friends.entity";

export class FriendsInterface {
  id?: string;
  user?: UsersInterface;
  friends?: UsersInterface;
  status?: Status;
  created_at?: Date;
}