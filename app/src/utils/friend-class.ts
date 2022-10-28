import {FriendDto} from "../app/core/dto/friend.dto";
import {UserDto} from "../app/core/dto/user.dto";

export const FriendClass = {
  id: 'friendID',
  friends: {} as UserDto,
  user: {} as UserDto,
  status: 'pending',
} as FriendDto
