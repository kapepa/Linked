import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {NewsService} from "../service/news.service";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NewsResolver implements Resolve<boolean> {
  constructor(
    private newsService: NewsService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.newsService.getOneNews(route.params.id).pipe(
      switchMap(() => of(true)),
    );
  }
}
