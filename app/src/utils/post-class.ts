import {UserClass} from "./user-class";
import {PostDto} from "../app/core/dto/post.dto";
import {AdditionDto} from "../app/core/dto/addition.dto";
import {CommentDto} from "../app/core/dto/comment.dto";

import {CommentInterface} from "../app/core/interface/comment.interface";
import {PostInterface} from "../app/core/interface/post.interface";

const PostClass = {
  id: 'postID',
  img: ['string.jpg'] as string[],
  video: {} as File,
  body: 'postBody',
  access: 'anyone',
  addition: {} as AdditionDto,
  author: UserClass,
  like: 5,
  comments: [] as CommentInterface[] | CommentDto[],
  // createdAt?: Date,
} as PostDto | PostInterface

const CommentClass = {
  id: 'idComment',
  host: UserClass,
  feet: PostClass,
  comment: 'comment',
  created_at: new Date(Date.now()),
} as CommentInterface | CommentDto;

PostClass.comments = [CommentClass] as CommentInterface[] | CommentDto[];

export { PostClass, CommentClass };
