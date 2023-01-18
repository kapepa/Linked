import {TypeEnum} from "./type.enum";
import {UsersDto} from "../users/users.dto";
import {ApiProperty} from "@nestjs/swagger";

export class EventDto {
  @ApiProperty()
  id?: string

  @ApiProperty({ type: () => UsersDto })
  user?: UsersDto

  @ApiProperty()
  date?: Date

  @ApiProperty()
  img?: string

  @ApiProperty()
  link?: string

  @ApiProperty()
  time?: string

  @ApiProperty()
  title?: string

  @ApiProperty()
  type?: TypeEnum

  @ApiProperty()
  description?: string
}