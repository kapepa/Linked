import {UsersDto} from "../users/users.dto";
import {ApiProperty} from "@nestjs/swagger";

export class NewsDto {
  @ApiProperty()
  id?: string;

  @ApiProperty({ type: () => UsersDto })
  author?: UsersDto;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  img?: string;

  @ApiProperty()
  content?: string;
}