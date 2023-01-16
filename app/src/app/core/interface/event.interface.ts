import {TypeEnum} from "../enum/type.enum";
import {UserInterface} from "./user.interface";

export class EventInterface {
  user?: UserInterface
  date?: Date
  img?: File
  link?: string
  time?: string
  title?: string
  type?: TypeEnum
  description?: string
}
