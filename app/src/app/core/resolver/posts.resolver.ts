import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { PostService } from "../service/post.service";
import { switchMap } from "rxjs/operators";
import { PostInterface } from "../interface/post.interface";

@Injectable({
  providedIn: 'root'
})
export class PostsResolver implements Resolve<boolean> {
  constructor(
    private postService: PostService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.postService.postLength.pipe(
      switchMap((length: number) => {
        return !!length ? of(true) : this.postService.getPosts({ take: 20, skip:0 }).pipe(
          switchMap(((posts: PostInterface[]) => of(true))
        ))
      })
    )
  }
}
