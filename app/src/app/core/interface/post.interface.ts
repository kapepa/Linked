import {UserInterface} from "./user.interface";
import {CommentInterface} from "./comment.interface";
import {AccessEnum} from "../enum/access.enum";

export interface PostInterface {
  id?: string,
  img?: string,
  video?: string,
  file?: string,
  body: string,
  access?: AccessEnum,
  author?: UserInterface,
  like?: UserInterface[],
  like_count?: number,
  comments?: CommentInterface[],
  createdAt?: Date,
}
