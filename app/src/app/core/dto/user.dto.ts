import {FriendDto} from "./friend.dto";

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
  exp: number
  iat: number
}
