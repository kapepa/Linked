import { UsersInterface } from "../users/users.interface";
import { CommentInterface } from "./comment.interface";
import { AccessEnum } from "./access.enum";
import { AdditionInterface } from "./addition.interface";

export interface FeetInterface {
  id?: string,
  img?: string,
  video?: string,
  file?: string,
  body?: string,
  access?: AccessEnum,
  addition?: AdditionInterface
  author?: UsersInterface,
  like?: UsersInterface[],
  comments?: CommentInterface[],
  like_count?: number,
  createdAt?: Date,
}
