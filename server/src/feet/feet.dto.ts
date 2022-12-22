import {UsersDto} from "../users/users.dto";
import {CommentDto} from "./comment.dto";
import {ApiProperty} from "@nestjs/swagger";
import {AccessEnum} from "./access.enum";

export class FeetDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  img?: string

  @ApiProperty()
  video?: string

  @ApiProperty()
  file?: string

  @ApiProperty()
  body: string

  @ApiProperty()
  access?: AccessEnum

  @ApiProperty({ type: () => UsersDto })
  author?: UsersDto

  @ApiProperty({ type: () => UsersDto })
  like?: UsersDto[]

  @ApiProperty()
  like_count?: number

  @ApiProperty({ type: () => CommentDto })
  comments?: CommentDto[]

  @ApiProperty()
  createdAt?: Date
}