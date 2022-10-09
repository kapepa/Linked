import {UsersDto} from "../users/users.dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class FeetDto {
  @ApiProperty()
  id?: string

  @ApiProperty()
  @IsString()
  body?: string

  @ApiProperty({ type: () => UsersDto })
  author?: UsersDto
}