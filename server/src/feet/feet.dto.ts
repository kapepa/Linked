import {UsersDto} from "../users/users.dto";
import {CommentDto} from "./comment.dto";
import {ApiProperty} from "@nestjs/swagger";
import {AccessEnum} from "./access.enum";
import {AdditionDto} from "./addition.dto";

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

  @ApiProperty({ type: () => AdditionDto })
  addition: AdditionDto

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