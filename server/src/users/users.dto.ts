import {Role} from "../auth/role.enum";
import {FeetInterface} from "../feet/feet.interface";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class UsersDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ enum: Role })
  role?: Role;

  @ApiProperty()
  feet?: FeetInterface[];

  @ApiProperty()
  created_at?: Date;
}