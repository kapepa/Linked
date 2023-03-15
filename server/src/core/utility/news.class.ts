import {UsersInterface} from "../../users/users.interface";
import {UserClass} from "./user.class";

const NewsClass = {
  id: 'newsID',
  author: UserClass,
  title: 'News Title',
  img: 'news.png',
  content: 'news content',
  created_at: new Date(Date.now()),
}

export { NewsClass }