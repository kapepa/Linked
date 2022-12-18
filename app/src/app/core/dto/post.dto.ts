import {UserDto} from "./user.dto";
import {CommentDto} from "./comment.dto";

export class PostDto {
  id?: string
  img?: string
  body: string
  author?: UserDto
  like?: number
  comments?: CommentDto[]
  createdAt?: Date
}
