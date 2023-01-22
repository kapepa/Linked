import {Status} from "../interface/friends.interface";
import {UserJwtDto} from "./user-jwt.dto";

export class FriendDto {
  id?: string;
  user?: UserJwtDto;
  friends?: UserJwtDto;
  status?: Status;
  created_at?: Date;
}
