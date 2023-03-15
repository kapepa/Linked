import {Test, TestingModule} from '@nestjs/testing';
import {NewsService} from './news.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {NewsEntity} from "./news.entity";
import {Repository} from "typeorm";
import {NewsClass} from "../core/utility/news.class";
import {NewsDto} from "./news.dto";
import {NewsInterface} from "./news.interface";

let MockNewsEntity = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
}

describe('NewsService', () => {
  let service: NewsService;
  let newsRepository: Repository<NewsEntity>;

  let newsClass = NewsClass;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: getRepositoryToken(NewsEntity), useValue: MockNewsEntity }
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    newsRepository = module.get<Repository<NewsEntity>>(getRepositoryToken(NewsEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createNews', () => {
    let mockNews = newsClass as NewsDto;
    let mockNewsEntity = newsClass as NewsDto | NewsInterface;
    let spyNewsSave = jest.spyOn(newsRepository, 'save').mockResolvedValue(newsClass as NewsEntity);

    service.createNews(mockNews).subscribe({
      next: (mews: NewsDto | NewsInterface) => {
        expect(mews).toEqual(mockNewsEntity);
        expect(spyNewsSave).toHaveBeenCalledWith(mockNews);
      }
    })
  })

  it('getNewsOne', () => {
    let mockNewsEntity = newsClass as NewsInterface;
    let option: { where?: { [key: string]: string | {[key: string]: string} }, relations?: string[] } = { where: { id: mockNewsEntity.id } };
    let spyFindOne = jest.spyOn(newsRepository, 'findOne').mockResolvedValue(mockNewsEntity as NewsEntity);

    service.getNewsOne(option).subscribe({
      next: (news: NewsInterface) => {
        expect(news).toEqual(mockNewsEntity);
        expect(spyFindOne).toHaveBeenCalledWith(option);
      }
    })
  })

  it('getNewsFind', () => {
    let options: { where?: { [key: string]: string | {[key: string]: string} }, skip?: number, take?: number, order?: { [key: string]: 'DESC' | 'ASC' | { [key: string]: 'DESC' | 'ASC' } }, relations?: string[] } =
      { skip: 0, take: 1 };
    let mockNewsEntity: NewsInterface[] = [newsClass] as NewsInterface[];
    let spyFind = jest.spyOn(newsRepository, 'find').mockResolvedValue(mockNewsEntity as NewsEntity[]);

    service.getNewsFind(options).subscribe({
      next: ( news: NewsInterface[] ) => {
        expect(news).toEqual(mockNewsEntity);
        expect(spyFind).toHaveBeenCalledWith(options);
      }
    })
  })

  it('saveNews', () => {
    let mockNews = newsClass as NewsDto;
    let mockNewsEntity = newsClass as NewsDto | NewsInterface;
    let spyNewsSave = jest.spyOn(newsRepository, 'save').mockResolvedValue(newsClass as NewsEntity);

    service.saveNews(mockNews).subscribe({
      next: (mews: NewsDto | NewsInterface) => {
        expect(mews).toEqual(mockNewsEntity);
        expect(spyNewsSave).toHaveBeenCalledWith(mockNews);
      }
    })
  })
});
