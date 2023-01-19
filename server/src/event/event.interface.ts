import {TypeEnum} from "./type.enum";
import {UsersInterface} from "../users/users.interface";
import {Column} from "typeorm";

export class EventInterface {
  id?: string
  user?: UsersInterface
  date?: Date | null
  img?: string
  link?: string
  time?: string
  title?: string
  type?: TypeEnum
  description?: string
}