import {TypeEnum} from "./type.enum";
import {UsersInterface} from "../users/users.interface";

export class EventInterface {
  user?: UsersInterface
  date?: Date
  img?: File
  link?: string
  time?: string
  title?: string
  type?: TypeEnum
  description?: string
}