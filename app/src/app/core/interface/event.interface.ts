import {TypeEnum} from "../enum/type.enum";
import {UserInterface} from "./user.interface";

export class EventInterface {
  id?: string
  user?: UserInterface
  date?: Date
  img?: File | string
  link?: string
  time?: string
  title?: string
  type?: TypeEnum
  description?: string
}
