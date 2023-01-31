import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {NewsService} from "../service/news.service";
import {switchMap} from "rxjs/operators";
import {NewsInterface} from "../interface/news.interface";

@Injectable({
  providedIn: 'root'
})
export class TidingsResolver implements Resolve<boolean> {
  constructor(
    private newsService: NewsService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.newsService.getTidings.pipe(
      switchMap((tidings: NewsInterface[]) => {
        if(!!tidings.length) return of(true);
        return this.newsService.findTidings({take: 4, skip: 0}).pipe(
          switchMap(() => of(true)),
        );
      })
    )
  }
}
