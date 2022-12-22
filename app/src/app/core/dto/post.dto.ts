import {UserDto} from "./user.dto";
import {CommentDto} from "./comment.dto";
import {AccessEnum} from "../enum/access.enum";

export class PostDto {
  id?: string
  img?: string
  video?: string
  file?: string
  body: string
  access?: AccessEnum
  author?: UserDto
  like?: number
  comments?: CommentDto[]
  createdAt?: Date
}
