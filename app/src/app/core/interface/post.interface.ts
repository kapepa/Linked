import {UserInterface} from "./user.interface";
import {CommentInterface} from "./comment.interface";

export interface PostInterface {
  id?: string,
  img?: string,
  video?: string,
  file?: string,
  body: string,
  author?: UserInterface,
  like?: UserInterface[],
  like_count?: number,
  comments?: CommentInterface[],
  createdAt?: Date,
}
