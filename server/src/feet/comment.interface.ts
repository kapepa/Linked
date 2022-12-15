import { UsersInterface } from "../users/users.interface";
import { FeetInterface } from "./feet.interface";

export class CommentInterface {
  id?: string
  host?: UsersInterface
  feet?: FeetInterface
  comment?: string
  created_at?: Date;
}