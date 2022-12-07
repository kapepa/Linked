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
  posts$: BehaviorSubject<PostInterface[]> = new BehaviorSubject<PostInterface[]>([]);

  searchWord = '';
  searchWord$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  firstLoad = true;
  firstLoad$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {
    this.searchWord$.subscribe((word: string) => {
      if(!this.firstLoad) this.getPosts({ word, take: 20, skip: 0 }, true).subscribe();
      if(this.firstLoad) this.setFirstLoad = !this.firstLoad;
    })
  }

  getPosts(query: PostQueryDto, search?: boolean): Observable<PostInterface[]> {
    return this.http.get<PostInterface[]>(`${this.configUrl}/api/feet`,{
      params: !this.searchWord.length ? {...query, word: this.searchWord} : {...query},
    }).pipe(
      take(1),
      tap((posts: PostInterface[]) => {
        search ? this.posts = posts : this.posts.push(...posts);
        this.setPosts = this.posts;
      }),
      catchError(this.httpService.handleError),
    )
  }

  createPost(body: {body: string}): Observable<PostInterface> {
    return this.http.post<PostInterface>(`${this.configUrl}/api/feet/create`,body).pipe(
      take(1),
      tap((post: PostInterface) => {
        this.posts.unshift(post);
        this.setPosts = this.posts;
      }),
      catchError(this.httpService.handleError),
    )
  }

  updatePost(index: number, id: string, body: PostInterface): Observable<PostInterface> {
    return this.http.patch<PostInterface>(`${this.configUrl}/api/feet/update/${id}`, body).pipe(
      take(1),
      tap((post: PostInterface) => {
        this.posts.splice(index, 1, {...this.posts[index], ...post})
        this.setPosts = this.posts;
      }),
      catchError(this.httpService.handleError)
    )
  }

  deletePost(index: number, id: string): Observable<any> {
    return this.http.delete(`${this.configUrl}/api/feet/${id}`).pipe(
      take(1),
      tap(() => {
        this.posts.splice(index,1);
        this.setPosts = this.posts;
      }),
      catchError(this.httpService.handleError)
    )
  }

  set setPosts(posts: PostInterface[]) {
    this.posts = posts;
    this.posts$.next(this.posts);
  }

  set setSearchWorld(word: string) {
    this.searchWord = word;
    this.searchWord$.next(this.searchWord);
  }

  set setFirstLoad(bool: boolean) {
    this.firstLoad = bool;
    this.firstLoad$.next(this.firstLoad);
  }

  get postLength(): Observable<number> {
    return this.posts$.asObservable().pipe(
      switchMap( (posts: PostInterface[]) => {
        return of(posts?.length ?? 0);
      })
    )
  }

  get getPostsAll(): Observable<PostInterface[]> {
    return this.posts$.asObservable();
  }
}
