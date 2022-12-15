import { UsersDto } from "../users/users.dto";
import { FeetDto } from "./feet.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
  @ApiProperty()
  id?: string

  @ApiProperty({ type: () => UsersDto })
  host?: UsersDto

  @ApiProperty({ type: () => FeetDto })
  feet?: FeetDto

  @ApiProperty()
  comment?: string

  @ApiProperty()
  created_at?: Date;
}
