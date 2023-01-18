import {TypeEnum} from "../enum/type.enum";
import {UserDto} from "./user.dto";

export class EventDto {
  id?: string
  user?: UserDto
  date?: Date
  img?: File | string
  link?: string
  time?: string
  title?: string
  type?: TypeEnum
  description?: string
}
