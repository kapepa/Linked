import {UsersInterface} from "../../users/users.interface";

export const FriendCLass = {
  id: 'friendID',
  user: {} as UsersInterface,
  friends: {} as UsersInterface,
  status: 'pending',
  created_at: Date.now(),
}