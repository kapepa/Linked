import {UserInterface} from "./user.interface";

export interface PostInterface {
  id?: string,
  body: string,
  author?: UserInterface,
  like?: UserInterface | UserInterface[] | number,
  like_count?: number,
  createdAt?: Date,
}
