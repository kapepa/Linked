import {UserInterface} from "./user.interface";
import {CommentInterface} from "./comment.interface";
import {AccessEnum} from "../enum/access.enum";
import {AdditionInterface} from "./addition.interface";

export interface PostInterface {
  id?: string,
  img?: string | File,
  video?: string,
  file?: string,
  body: string,
  access?: AccessEnum,
  addition?: AdditionInterface,
  author?: UserInterface,
  like?: UserInterface[],
  like_count?: number,
  comments?: CommentInterface[],
  createdAt?: Date,
}
