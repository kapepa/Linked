import {Role} from "../auth/role.enum";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {FeetDto} from "../feet/feet.dto";
import {FriendsDto} from "../friends/friends.dto";

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

  @ApiProperty({type: () => FriendsDto})
  request?: FriendsDto[]

  @ApiProperty({type: () => FriendsDto})
  suggest?: FriendsDto[];

  @ApiProperty()
  friends?: UsersDto[];

  @ApiProperty({ enum: Role })
  role?: Role;

  @ApiProperty({type: () => FeetDto})
  feet?: FeetDto[];

  @ApiProperty()
  created_at?: Date;

  iat?: number;
  exp?: number;
}