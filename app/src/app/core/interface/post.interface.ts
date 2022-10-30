import {UserInterface} from "./user.interface";

export interface PostInterface {
  id?: string,
  body: string,
  author?: UserInterface,
  createdAt?: Date,
}
