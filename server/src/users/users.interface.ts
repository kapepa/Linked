import {Role} from "../auth/role.enum";
import {FeetInterface} from "../feet/feet.interface";
import {FriendsInterface} from "../friends/friends.interface";

export class UsersInterface {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  request?: FriendsInterface[];
  suggest?: FriendsInterface[];
  friends?: UsersInterface[];
  role: Role;
  feet?: FeetInterface[];
  created_at?: Date;
}