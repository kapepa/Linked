import { UsersInterface } from "../../users/users.interface";
import { FeetInterface } from "../../feet/feet.interface";

export let FeetClass = {
  id: 'feetID',
  body: 'body beet',
  author: {} as UsersInterface,
  createdAt: new Date(),
} as FeetInterface;