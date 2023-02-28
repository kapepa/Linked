import {UserDto} from "../app/core/dto/user.dto";
import {FriendDto} from "../app/core/dto/friend.dto";
import {PostDto} from "../app/core/dto/post.dto";
import {PostClass} from "./post-class";
import {UserInterface} from "../app/core/interface/user.interface";
import {FriendsInterface} from "../app/core/interface/friends.interface";
import {PostInterface} from "../app/core/interface/post.interface";

export const UserClass = {
  id: 'userID',
  firstName: 'userName',
  lastName: '',
  avatar: '',
  role: 'user',
  friends: [] as UserDto[] | UserInterface[],
  request: [] as FriendDto[] | FriendsInterface[],
  suggest: [] as FriendDto[] | FriendsInterface[],
  feet: [] as PostDto[] | PostInterface[],
  exp: Date.now() + 1000 * 60 * 60
} as UserDto | UserInterface
