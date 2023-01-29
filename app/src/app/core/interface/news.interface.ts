import {UserInterface} from "./user.interface";

export interface NewsInterface {
  id?: string;
  author?: UserInterface;
  title?: string;
  img?: string;
  content?: string;
}
