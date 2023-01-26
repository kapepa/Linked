import {FriendDto} from "./friend.dto";
import {Role} from "./user.dto";

export class UserJwtDto {
  id: string
  firstName: string
  lastName: string
  avatar: string
  request?: any[]
  suggest?: any[]
  friends?: any[]
  role: Role
  exp: number
  iat: number
}
