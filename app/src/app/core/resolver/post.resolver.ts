import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {PostService} from "../service/post.service";
import {switchMap} from "rxjs/operators";
import {PostInterface} from "../interface/post.interface";

@Injectable({
  providedIn: 'root'
})
export class PostResolver implements Resolve<boolean> {
  constructor(
    private postService: PostService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.postService.getOnePost(route.paramMap.get('id')).pipe(
      switchMap((post: PostInterface) => {
        return of(!!post);
      })
    )
  }
}
