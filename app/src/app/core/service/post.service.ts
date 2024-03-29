import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable, of } from "rxjs";
import { PostInterface } from "../interface/post.interface";
import { PostQueryDto } from "../dto/post-query.dto";
import { catchError, switchMap, take, tap } from "rxjs/operators";
import { HttpService } from "./http.service";
import { CommentInterface } from "../interface/comment.interface";
import { AdditionDto } from "../dto/addition.dto";
import { PostDto } from "../dto/post.dto";
import { AdditionInterface } from "../interface/addition.interface";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  configUrl = environment.configUrl;

  post: PostInterface;
  post$: BehaviorSubject<PostInterface> = new BehaviorSubject(null);

  posts: PostInterface[] = [] as PostInterface[];
  posts$: BehaviorSubject<PostInterface[]> = new BehaviorSubject<PostInterface[]>([]);

  searchWord = '';
  searchWord$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  postLoad = false;
  postLoad$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  firstLoad = true;
  firstLoad$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  createdPost: PostDto | PostInterface;
  createdPost$: BehaviorSubject<PostDto | PostInterface> = new BehaviorSubject<PostDto | PostInterface>(null);

  createAddition: AdditionDto | AdditionInterface;
  createAddition$: BehaviorSubject<AdditionDto | AdditionInterface> = new BehaviorSubject<AdditionDto | AdditionInterface>(null);

  createImg: File[] = [];
  createImg$: BehaviorSubject<File[]> = new BehaviorSubject<File[]>(this.createImg);

  editPost: PostDto | PostInterface;
  editPost$: BehaviorSubject<PostDto | PostInterface> = new BehaviorSubject<PostDto | PostInterface>(null);

  editAddition: AdditionDto | AdditionInterface;
  editAddition$: BehaviorSubject<AdditionDto | AdditionInterface> = new BehaviorSubject<AdditionDto | AdditionInterface>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private httpService: HttpService,
  ) {
    this.searchWord$.subscribe((word: string) => {
      if(!this.firstLoad) this.getPosts({ word, take: 20, skip: 0 }, true).subscribe();
      if(this.firstLoad) this.setFirstLoad = !this.firstLoad;
    })
  }

  getPosts(query: PostQueryDto, search?: boolean): Observable<PostInterface[]> {
    this.setPostLoad = !this.postLoad;
    return this.http.get<PostInterface[]>(`${this.configUrl}/api/feet`,{
      params: !this.searchWord.length ? {...query, word: this.searchWord} : {...query},
    }).pipe(
      take(1),
      tap({
        next: (posts: PostInterface[]) => {
          search ? this.posts = posts : this.posts.push(...posts);
          this.setPosts = this.posts;
        },
        complete: () => this.setPostLoad = !this.postLoad,
      }),
      catchError(this.httpService.handleError),
    )
  }

  createPost(body: PostDto): Observable<PostInterface> {
    this.setPostLoad = !this.postLoad;
    let form = this.toForm({...body, addition: this.createAddition as AdditionDto});

    return this.http.post<PostInterface>(
      `${this.configUrl}/api/feet/create`, form,
    ).pipe(
      take(1),
      tap({
        next: (post: PostInterface) => {
          this.posts.unshift(post);
          this.setPosts = this.posts;
        },
        complete: () => {
          this.setCreateImages = [];
          this.setPostLoad = !this.postLoad;
        },
      }),
      catchError(this.httpService.handleError),
    )
  }

  updatePost(index: number, id: string, body: PostInterface | PostDto): Observable<PostInterface> {
    this.setPostLoad = !this.postLoad;
    let form = this.toForm({...body, addition: this.editAddition} as PostInterface);
    return this.http.patch<PostInterface>(`${this.configUrl}/api/feet/update/${id}`, form).pipe(
      take(1),
      tap({
        next: (post: PostInterface) => {
          this.posts.splice(index, 1, {...this.posts[index], ...post})
          this.setPosts = this.posts;
        },
        complete: () => this.setPostLoad = !this.postLoad,
      }),
      catchError(this.httpService.handleError)
    )
  }

  getOnePost(id: string): Observable<PostInterface> {
    this.setPostLoad = !this.postLoad;
    return this.http.get<PostInterface>(`${this.configUrl}/api/feet/one/${id}`).pipe(
      take(1),
      tap({
        next: (feet: PostInterface) => this.setPost = feet,
        complete: () => this.setPostLoad = !this.postLoad,
      }),
      catchError(this.httpService.handleError),
    )
  }

  likePost(postID: string): Observable<PostInterface> {
    this.setPostLoad = !this.postLoad;
    return this.http.put<PostInterface>(`${this.configUrl}/api/feet/like/${postID}`,{}).pipe(
      take(1),
      tap({ complete: () => this.setPostLoad = !this.postLoad }),
      catchError(this.httpService.handleError),
    )
  }

  likeTapePost(postID: string, index: number) {
    return this.likePost(postID).pipe(
      tap((post: PostInterface) => {
        this.posts.splice(index,1,post);
        this.setPosts = this.posts;
      })
    );
  }

  deletePost(index: number, id: string): Observable<any> {
    this.setPostLoad = !this.postLoad;
    return this.http.delete(`${this.configUrl}/api/feet/${id}`).pipe(
      take(1),
      tap({
        next: () => {
          this.posts.splice(index,1);
          this.setPosts = this.posts;
        },
        complete: () => this.setPostLoad = !this.postLoad,
      }),
      catchError(this.httpService.handleError)
    )
  }

  deleteComment(index: number, commentID: string): Observable<{raw: any[], affected: number}> {
    return this.http.delete<{raw: any[], affected: number}>(`${this.configUrl}/api/feet/comment/${commentID}`).pipe(
      take(1),
      tap(() => {
        if( this.post.comments[index].id === commentID) {
          this.post.comments.splice(index,1);
          this.setPost = this.post;
        }
      }),
      catchError(this.httpService.handleError),
    );
  }

  createComment(postID: string, body: { comment: string }): Observable<CommentInterface>{
    this.setPostLoad = !this.postLoad;
    return this.http.post<CommentInterface>(`${this.configUrl}/api/feet/comment/create/${postID}`, body).pipe(
      take(1),
      tap({
        next: (comment: CommentInterface) => {
          this.post.comments.unshift(comment);
          this.setPost = this.post;
        },
        complete: () => this.setPostLoad = !this.postLoad,
      }),
      catchError(this.httpService.handleError),
    )
  }

  receiveComment(query: {skip: number, take: number}): Observable<CommentInterface[]> {
    this.setPostLoad = ! this.postLoad;
    return this.http.get<CommentInterface[]>(`${this.configUrl}/api/feet/comments`,{
      params: {...query, id: this.post.id},
    }).pipe(
      take(1),
      tap({
        next: (comments: CommentInterface[]) => {
          this.post.comments.push(...comments);
          this.setPost = this.post;
        },
        complete: () => this.setPostLoad = !this.setPostLoad,
      }),
      catchError(this.httpService.handleError),
    );
  }

  toForm(post: PostDto | Omit<PostInterface, 'img'>) {
    let fromData = new FormData();
    for (let key in post) {
      if(key !== 'addition') fromData.append(key, post[key]);
      if(key === 'addition') for (let val in post[key]) fromData.append(`${key}[${val}]`, post[key][val]);
      if(key === 'img') for (let i = 0; i < post[key].length; i++) fromData.append(`${key}`, post[key][i]);
    }
    return fromData;
  }

  findEdit(id: string) {
    let edit = this.posts.find((post) => post.id === id);
    this.setEditPost = edit;
    this.setEditAddition = edit.addition;
  }

  indexEdit(index: number): Observable<boolean> {
    return  this.authService.userID
      .pipe(
        switchMap((userID: string) => {
          let post = this.posts[index];
          if( post.author.id === userID) {
            this.setEditPost = post;
            this.setEditAddition = post.addition;
            return of(true);
          };
          return of(false);
        })
      )
  }

  installPostField(post: PostDto){
    this.setCreatedPost = {...this.post, ...post} as PostDto;
  }

  set setPost(post: PostInterface) {
    this.post = post;
    this.post$.next(this.post);
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

  set setPostLoad(bool: boolean) {
    this.postLoad = bool;
    this.postLoad$.next(this.postLoad);
  }

  set setCreateAddition(addition: AdditionDto | AdditionInterface) {
    this.createAddition = addition;
    this.createAddition$.next(this.createAddition);
  }

  set setEditAddition(addition: AdditionDto | AdditionInterface) {
    this.editAddition = addition;
    this.editAddition$.next(this.editAddition);
  }

  set setCreatedPost(post: PostDto) {
    this.createdPost = post;
    this.createdPost$.next(this.createdPost);
  }

  set setEditPost(post: PostDto | PostInterface) {
    this.editPost = post;
    this.editPost$.next(this.editPost);
  }

  set setCreateImg(img: File) {
    this.createImg = this.createImg.concat(img);
    this.createImg$.next(this.createImg);
  }

  set setCreateImages(img: File[]) {
    this.createImg = img;
    this.createImg$.next(this.createImg);
  }

  get getCreateImg() {
    return this.createImg$.asObservable();
  }

  get getComments(): Observable<CommentInterface[]> {
    return this.post$.asObservable().pipe(
      switchMap((post: PostInterface) => {
        return of(post.comments);
      })
    )
  }

  get getPost(): Observable<PostInterface> {
    return this.post$.asObservable();
  }

  get getPostLoad(): Observable<boolean> {
    return this.postLoad$.asObservable();
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

  get getCreateAddition(): Observable<AdditionDto | AdditionInterface> {
    return this.createAddition$.asObservable();
  }

  get getEditAddition(): Observable<AdditionDto | AdditionInterface> {
    return this.editAddition$.asObservable();
  }

  get getCreatedPost(): Observable<PostDto | PostInterface> {
    return this.createdPost$.asObservable();
  }

  get getEditPost(): Observable<PostDto | PostInterface> {
    return this.editPost$.asObservable();
  }
}
