import {UserDto} from "../app/core/dto/user.dto";
import {FriendDto} from "../app/core/dto/friend.dto";

export const UserClass = {
  id: 'userID',
  firstName: 'userName',
  lastName: '',
  avatar: '',
  role: 'user',
  friends: [] as UserDto[],
  request: [] as FriendDto[],
  suggest: [] as FriendDto[],
} as UserDto
