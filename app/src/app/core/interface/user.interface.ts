import {PostInterface} from "./post.interface";
import {FriendsInterface} from "./friends.interface";
import {CommentInterface} from "./comment.interface";

export type Role = 'user' | 'admin' | 'ghost';

export interface UserInterface {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  request?: FriendsInterface[];
  suggest?: FriendsInterface[];
  friends?: UserInterface[];
  my_like?: PostInterface[];
  comment: CommentInterface[]
  role: Role;
  feet?: PostInterface[];
  created_at?: Date;
}
