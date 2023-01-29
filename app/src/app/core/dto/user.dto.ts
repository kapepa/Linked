import { FriendDto } from "./friend.dto";
import { PostDto } from "./post.dto";
import { ChatDto } from "./chat.dto";
import {CommentDto} from "./comment.dto";
import {EventDto} from "./event.dto";
import {NewsDto} from "./news.dto";

export type Role = 'admin' | 'ghost' | 'user';

export class UserDto {
  id: string
  firstName: string
  lastName: string
  avatar: string
  request?: FriendDto[]
  suggest?: FriendDto[]
  friends?: UserDto[]
  role?: Role
  feet?: PostDto[]
  chat?: ChatDto[]
  comment?: CommentDto[]
  event?: EventDto
  news?: NewsDto[]
  exp?: number
  iat?: number
}
