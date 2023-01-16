import {TypeEnum} from "./type.enum";
import {UsersDto} from "../users/users.dto";

export class EventDto {
  user?: UsersDto
  date?: Date
  img?: File
  link?: string
  time?: string
  title?: string
  type?: TypeEnum
  description?: string
}