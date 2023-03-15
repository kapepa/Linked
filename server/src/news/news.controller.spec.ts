import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import {NewsService} from "./news.service";
import {NewsClass} from "../core/utility/news.class";
import {UserClass} from "../core/utility/user.class";
import {UsersDto} from "../users/users.dto";
import {NewsInterface} from "./news.interface";
import {of} from "rxjs";
import {NewsDto} from "./news.dto";

let MockNewsService = {
  createNews: jest.fn(),
  getNewsFind: jest.fn(),
  getNewsOne: jest.fn(),
}

describe('NewsController', () => {
  let controller: NewsController;
  let newsService: NewsService;

  let userClass = UserClass;
  let newsClass = NewsClass;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        { provide: NewsService, useValue: MockNewsService }
      ]
    }).compile();

    controller = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createNews', () => {
    let mockUser = userClass as UsersDto;
    let { created_at, ...mockNews } = newsClass as NewsInterface;
    let spyCreateNews = jest.spyOn(newsService, 'createNews').mockImplementation(() => of(mockNews as NewsDto | NewsInterface));

    controller.createNews({} as Express.Multer.File, mockNews, { user: mockUser }).subscribe({
      next: (news: NewsDto | NewsInterface) => {
        expect(news).toEqual(mockNews);
        expect(spyCreateNews).toHaveBeenCalledWith({...mockNews,  author: mockUser, img: undefined})
      }
    })
  })

  it('findNews', () => {
    let query: {take?: number, skip?: number} = { take: 1, skip: 0 };
    let mockUser = userClass as UsersDto;
    let mockNews: NewsInterface[] = [newsClass] as NewsInterface[];
    let spyGetNewsFind = jest.spyOn(newsService, 'getNewsFind').mockImplementation(() => of(mockNews));

    controller.findNews(query, { user: mockUser }).subscribe({
      next: ( news: NewsInterface[] ) => {
        expect(news).toEqual(mockNews);
        expect(spyGetNewsFind).toHaveBeenCalledWith({
          take: Number(query.take),
          skip: Number(query.skip),
          order: { created_at: "ASC" },
          relations: ['author'],
        })
      }
    })
  })

  it('oneNews', () => {
    let mockNews: NewsInterface = newsClass as NewsInterface;
    let spyGetNewsOne = jest.spyOn(newsService, 'getNewsOne').mockImplementation(() => of(mockNews));

    controller.oneNews({ id: mockNews.id }, { }).subscribe({
      next: (news: NewsInterface) => {
        expect(news).toEqual(mockNews);
        expect(spyGetNewsOne).toHaveBeenCalledWith({ where: { id: mockNews.id }, relations: ['author'] });
      }
    })
  })
});