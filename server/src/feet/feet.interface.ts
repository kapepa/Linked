import {UsersInterface} from "../users/users.interface";

export interface FeetInterface {
  id: string,
  body: string,
  author?: UsersInterface,
  createdAt?: Date,
}
