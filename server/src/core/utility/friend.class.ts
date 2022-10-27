import {UsersInterface} from "../../users/users.interface";
import {FriendsInterface} from "../../friends/friends.interface";

export const FriendCLass = {
  id: 'friendID',
  user: {} as UsersInterface,
  friends: {} as UsersInterface,
  status: 'pending',
  // created_at: Date.now(),
} as FriendsInterface