import {ApiProperty} from "@nestjs/swagger";
import {UsersDto} from "../users/users.dto";
import {Status} from "./friends.entity";

export class FriendsDto {
  @ApiProperty()
  id?: string;

  @ApiProperty({type: () => UsersDto})
  user?: UsersDto

  @ApiProperty({type: () => UsersDto})
  friends?: UsersDto

  @ApiProperty({ enum: Status })
  status?: Status

  @ApiProperty()
  created_at?: Date;
}