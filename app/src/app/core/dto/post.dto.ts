import {UserDto} from "./user.dto";
import {CommentDto} from "./comment.dto";
import {AccessEnum} from "../enum/access.enum";
import {AdditionDto} from "./addition.dto";

export class PostDto {
  id?: string
  img?: string[]
  video?: string | File
  file?: string | File
  body?: string
  access?: AccessEnum
  addition?: AdditionDto
  author?: UserDto
  like?: number
  comments?: CommentDto[]
  createdAt?: Date
}
