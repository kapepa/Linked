import {UserDto} from "./user.dto";

export class NewsDto {
  id?: string;
  author?: UserDto;
  title?: string;
  img?: string;
  content?: string;
  created_at?: Date;
}
