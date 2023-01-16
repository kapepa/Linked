import {TypeEnum} from "../enum/type.enum";
import {UserDto} from "./user.dto";

export class EventDto {
  user?: UserDto
  date?: Date
  img?: File
  link?: string
  time?: string
  title?: string
  type?: TypeEnum
  description?: string
}
