import { UserDto } from "./user.dto";
import { ChatDto } from "./chat.dto";
import { StatusEnum } from "../enum/status.enum";

export class MessageDto {
  id?: string;
  owner?: UserDto;
  chat?: ChatDto;
  message?: string;
  status?: StatusEnum;
  created_at: Date;
}
