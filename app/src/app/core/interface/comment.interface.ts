import {PostInterface} from "./post.interface";
import {UserInterface} from "./user.interface";

export class CommentInterface {
  id?: string
  host?: UserInterface
  feet?: PostInterface
  comment?: string
  created_at?: Date;
}
