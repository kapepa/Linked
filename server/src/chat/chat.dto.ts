import { UsersDto } from "../users/users.dto";
import { ApiProperty } from "@nestjs/swagger";
import { MessageDto } from "./message.dto";

export class ChatDto {
  @ApiProperty()
  id?: string;

  @ApiProperty({type: () => UsersDto})
  conversation?: UsersDto[];

  @ApiProperty({type: () => MessageDto})
  chat?: MessageDto[];

  @ApiProperty()
  updated_at?: Date;
}