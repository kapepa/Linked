import {Role} from "../auth/role.enum";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {FeetDto} from "../feet/feet.dto";
import {FriendsDto} from "../friends/friends.dto";
import {CommentDto} from "../feet/comment.dto";
import {FeetInterface} from "../feet/feet.interface";

export class UsersDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  password?: string;

  @ApiProperty()
  avatar?: string

  @ApiProperty({ type: () => FriendsDto })
  request?: FriendsDto[]

  @ApiProperty({ type: () => FriendsDto })
  suggest?: FriendsDto[];

  @ApiProperty()
  friends?: UsersDto[];

  @ApiProperty({ type: () => CommentDto })
  comments?: CommentDto[]

  @ApiProperty({ enum: Role })
  role?: Role;

  @ApiProperty({ type: () => FeetDto })
  feet?: FeetDto[];

  @ApiProperty({ type: () => FriendsDto })
  my_like?: FeetInterface[]

  @ApiProperty()
  created_at?: Date;

  iat?: number;
  exp?: number;
}