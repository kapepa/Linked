import { UserDto } from "./user.dto";

export class ChatDto {
  owner: UserDto;
  message: string;
}
