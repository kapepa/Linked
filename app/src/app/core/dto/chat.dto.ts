import { UserDto } from "./user.dto";
import { MessageDto } from "./message.dto";

export class ChatDto {
  id?: string
  conversation?: UserDto[];
  chat?: MessageDto[];
  updated_at?: Date;
}
