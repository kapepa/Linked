import {UserClass} from "./user-class";
import {NewsDto} from "../app/core/dto/news.dto";

export const NewsClass = {
  id: "newsID",
  author: UserClass,
  title: "newsTitle",
  img: "newsImg",
  content: "news content",
} as NewsDto;
