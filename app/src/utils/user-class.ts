import {UserDto} from "../app/core/dto/user.dto";
import {FriendDto} from "../app/core/dto/friend.dto";
import {PostDto} from "../app/core/dto/post.dto";
import {PostClass} from "./post-class";

export const UserClass = {
  id: 'userID',
  firstName: 'userName',
  lastName: '',
  avatar: '',
  role: 'user',
  friends: [] as UserDto[],
  request: [] as FriendDto[],
  suggest: [] as FriendDto[],
  feet: [] as PostDto[],
  exp: Date.now() + 1000 * 60 * 60
} as UserDto
