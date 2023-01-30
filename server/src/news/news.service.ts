import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {NewsEntity} from "./news.entity";
import {Repository} from "typeorm";
import {from, Observable} from "rxjs";
import {NewsDto} from "./news.dto";
import {NewsInterface} from "./news.interface";

@Injectable()
export class NewsService {

  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
  ) {}

  createNews(event: NewsDto): Observable<NewsDto | NewsInterface> {
    return this.saveNews(event);
  }

  getNewsOne(event: { where?: { [key: string]: string | {[key: string]: string} }, relations?: string[] }): Observable<NewsInterface>{
    return from(this.newsRepository.findOne(event));
  }

  getNewsFind(events: {
    where?: { [key: string]: string | {[key: string]: string} },
    skip?: number,
    take?: number,
    order?: { [key: string]: 'DESC' | 'ASC' | { [key: string]: 'DESC' | 'ASC' } },
    relations?: string[],
  }): Observable<NewsInterface[]> {
    return from(this.newsRepository.find(events));
  }

  saveNews(event: NewsDto | NewsInterface): Observable<NewsDto | NewsInterface>{
    return from(this.newsRepository.save(event));
  }
}
