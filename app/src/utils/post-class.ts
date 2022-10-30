import {UserClass} from "./user-class";
import {PostDto} from "../app/core/dto/post.dto";

export const PostClass = {
  id: 'postID',
  body: 'postBody',
  author: UserClass,
  // createdAt?: Date,
} as PostDto

