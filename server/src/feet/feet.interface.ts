import { UsersInterface } from "../users/users.interface";
import { CommentInterface } from "./comment.interface";

export interface FeetInterface {
  id?: string,
  img?: string,
  video?: string,
  file?: string,
  body?: string,
  author?: UsersInterface,
  like?: UsersInterface[],
  comments?: CommentInterface[],
  like_count?: number,
  createdAt?: Date,
}
