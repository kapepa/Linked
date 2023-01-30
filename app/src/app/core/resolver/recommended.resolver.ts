import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {NewsService} from "../service/news.service";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RecommendedResolver implements Resolve<boolean> {
  constructor(
    private newsService: NewsService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.newsService.findEvents({take: 4, skip: 0}).pipe(
      switchMap(() => of(true)),
    )
  }
}
