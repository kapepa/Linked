import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {catchError, take, tap} from "rxjs/operators";
import {NewsInterface} from "../interface/news.interface";

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  configUrl = environment.configUrl;

  newsLoader: boolean = false;
  newsLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.newsLoader);

  news: NewsInterface[] = [];
  news$: BehaviorSubject<NewsInterface[]> = new BehaviorSubject<NewsInterface[]>(this.news);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  createNews(news): Observable<NewsInterface>{
    this.setNewsLoader = !this.newsLoader;
    const form = this.httpService.toForm({...news, img: news.img});
    return this.http.post<NewsInterface>(`${this.configUrl}/api/news/create`, form).pipe(
      take(1),
      tap({
        next: (news: NewsInterface) => console.log(news),
        complete: () => this.setNewsLoader = !this.newsLoader,
      }),
      catchError(this.httpService.handleError),
    )
  }

  findEvents(query?: {take?: number, skip?: number}): Observable<NewsInterface[]> {
    this.setNewsLoader = !this.newsLoader;
    return this.http.get<NewsInterface[]>(`${this.configUrl}/api/news/find`, {params: query}).pipe(
      take(1),
      tap({
        next: (news: NewsInterface[]) => {
          let copyNews = [...this.news];
          copyNews.push(...news);
          this.setNews = copyNews;
        },
        complete: () => this.setNewsLoader = !this.newsLoader,
      })
    )
  }

  set setNewsLoader(bool: boolean) {
    this.newsLoader = bool;
    this.newsLoader$.next(this.newsLoader);
  }

  set setNews(news: NewsInterface[]) {
    this.news = news;
    this.news$.next(this.news);
  }

  get getNews() {
    return this.news$.asObservable();
  }

  get getNewsLoader() {
    return this.newsLoader$.asObservable();
  }
}
