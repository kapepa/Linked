import { UsersInterface } from "../../users/users.interface";
import { FeetInterface } from "../../feet/feet.interface";
import {CommentInterface} from "../../feet/comment.interface";
import {AccessEnum} from "../../feet/access.enum";

export let FeetClass = {
  id: 'feetID',
  img: ['feetImg'],
  video: '',
  file: '',
  body: 'body feet',
  access: AccessEnum.CONTACT,
  author: {} as UsersInterface,
  like: [],
  comments: [] as CommentInterface[],
  like_count: 0
  // createdAt: new Date(Date.now()),
} as FeetInterface;