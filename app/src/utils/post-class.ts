import {PostInterface} from "../app/core/interface/post.interface";
import {UserClass} from "./user-class";

export const PostClass = {
  id: 'postID',
  body: 'postBody',
  author: UserClass,
  // createdAt?: Date,
} as PostInterface

