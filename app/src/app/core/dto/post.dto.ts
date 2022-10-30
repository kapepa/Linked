import {UserDto} from "./user.dto";

export class PostDto {
  id?: string
  body: string
  author?: UserDto
  createdAt?: Date
}
