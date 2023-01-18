import {TypeEnum} from "./type.enum";
import {UsersInterface} from "../users/users.interface";

export class EventInterface {
  id?: string
  user?: UsersInterface
  date?: Date
  img?: string
  link?: string
  time?: string
  title?: string
  type?: TypeEnum
  description?: string
}