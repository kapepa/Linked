import {UsersDto} from "../users/users.dto";
import {CommentDto} from "./comment.dto";
import {ApiProperty} from "@nestjs/swagger";

export class FeetDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  body: string

  @ApiProperty({ type: () => UsersDto })
  author?: UsersDto

  @ApiProperty({ type: () => UsersDto })
  like?: UsersDto[]

  @ApiProperty({ type: () => CommentDto })
  comments?: CommentDto[]

  @ApiProperty()
  like_count?: number

  @ApiProperty()
  createdAt?: Date
}