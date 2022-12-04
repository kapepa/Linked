import { FriendDto } from "./friend.dto";
import { PostDto } from "./post.dto";
import { ChatDto } from "./chat.dto";

export type Role = 'admin' | 'ghost' | 'user';

export class UserDto {
  id: string
  firstName: string
  lastName: string
  avatar: string
  request?: FriendDto[]
  suggest?: FriendDto[]
  friends?: UserDto[]
  role: Role
  feet: PostDto[]
  chat: ChatDto[]
  exp: number
  iat: number
}
