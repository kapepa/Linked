import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable, of } from "rxjs";
import { PostInterface } from "../interface/post.interface";
import { PostQueryDto } from "../dto/post-query.dto";
import { catchError, switchMap, take, tap } from "rxjs/operators";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  configUrl = environment.configUrl;
  posts: PostInterface[] = [] as PostInterface[];
  posts$: BehaviorSubject<PostInterface[]> = new BehaviorSubject<PostInterface[]>(null);

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  getPosts(query: PostQueryDto): Observable<PostInterface[]> {
    return this.http.get<PostInterface[]>(`${this.configUrl}/api/feet`,{
      params: {...query},
    }).pipe(
      take(1),
      tap((posts: PostInterface[]) => {
        if(posts.length) {
          this.posts.push(...posts);
          this.posts$.next(this.posts);
        }
      }),
      catchError(this.httpService.handleError),
    )
  }

  createPost(body: {body: string}): Observable<PostInterface> {
    return this.http.post<PostInterface>(`${this.configUrl}/api/feet/create`,body).pipe(
      take(1),
      tap((post: PostInterface) => {
        this.posts.unshift(post);
        this.posts$.next(this.posts);
      }),
      catchError(this.httpService.handleError),
    )
  }

  updatePost(index: number, id: string, body: PostInterface): Observable<any> {
    return this.http.patch(`${this.configUrl}/api/feet/update/${id}`, body).pipe(
      take(1),
      tap((post: PostInterface) => {
        this.posts.splice(index,1, post);
        this.posts$.next(this.posts);
      }),
      catchError(this.httpService.handleError)
    )
  }

  deletePost(index: number, id: string): Observable<any> {
    return this.http.delete(`${this.configUrl}/api/feet/${id}`).pipe(
      take(1),
      tap(() => {
        this.posts.splice(index,1);
        this.posts$.next(this.posts);
      }),
      catchError(this.httpService.handleError)
    )
  }

  get postLength() {
    return this.posts$.asObservable().pipe(
      switchMap( (posts: PostInterface[]) => {
        return of(posts?.length ?? 0);
      })
    )
  }

}
