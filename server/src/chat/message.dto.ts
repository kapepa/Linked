import { ApiProperty } from "@nestjs/swagger";
import { UsersDto } from "../users/users.dto";
import { MessageStatus } from "./status.enum";
import { ChatDto } from "./chat.dto";

export class MessageDto {
  @ApiProperty()
  id?: string;

  @ApiProperty({type: () => UsersDto})
  owner?: UsersDto;

  @ApiProperty({type: () => ChatDto})
  chat?: ChatDto;

  @ApiProperty()
  message?: string;

  @ApiProperty({type: () => MessageStatus})
  status?: MessageStatus;

  @ApiProperty()
  created_at?: Date;
}