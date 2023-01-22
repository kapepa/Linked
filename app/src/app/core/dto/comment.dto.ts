import {UserDto} from "./user.dto";
import {PostDto} from "./post.dto";

export class CommentDto {
  id?: string
  host?: UserDto
  feet?: PostDto
  comment?: string
  created_at?: Date;
}
