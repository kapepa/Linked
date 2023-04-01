import { UsersInterface } from "../../users/users.interface";
import { FeetInterface } from "../../feet/feet.interface";
import {CommentInterface} from "../../feet/comment.interface";

export let FeetClass = {
  id: 'feetID',
  body: 'body feet',
  author: {} as UsersInterface,
  comments: [] as CommentInterface[],
  // createdAt: new Date(Date.now()),
} as FeetInterface;