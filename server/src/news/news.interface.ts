import {UsersInterface} from "../users/users.interface";

export interface NewsInterface {
  id?: string;
  author?: UsersInterface;
  title?: string;
  img?: string;
  content?: string;
  created_at?: Date;
}
