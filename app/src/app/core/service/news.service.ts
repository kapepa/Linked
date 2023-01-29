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

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  createNews(news): Observable<NewsInterface>{
    this.setNewsLoader = !this.newsLoader;
    const form = this.httpService.toForm({...news, file: news.img});
    return this.http.post<NewsInterface>(`${this.configUrl}/api/news/create`, form,).pipe(
      take(1),
      tap({
        next: (news: NewsInterface) => console.error(news),
        complete: () => this.setNewsLoader = !this.newsLoader,
      }),
      catchError(this.httpService.handleError),
    )
  }

  set setNewsLoader(bool: boolean) {
    this.newsLoader = bool;
    this.newsLoader$.next(this.newsLoader);
  }

  get getNewsLoader() {
    return this.newsLoader$.asObservable();
  }
}
