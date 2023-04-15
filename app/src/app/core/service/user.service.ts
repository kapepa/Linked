import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {BehaviorSubject, from, Observable} from "rxjs";
import { UserInterface } from "../interface/user.interface";
import { catchError, take, tap } from "rxjs/operators";
import { HttpService } from "./http.service";
import { FriendsInterface } from "../interface/friends.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  configUrl = environment.configUrl;

  user: UserInterface;
  user$: BehaviorSubject<UserInterface> = new BehaviorSubject<UserInterface>(null);

  userLoader: boolean = false;
  userLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.userLoader);

  recommended: UserInterface[] = [] as UserInterface[];
  recommended$: BehaviorSubject<UserInterface[]> = new BehaviorSubject<UserInterface[]>(this.recommended);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  getOwnProfile(): Observable<UserInterface> {
    this.setUserLoader = !this.userLoader;
    return this.http.get<UserInterface>(`${this.configUrl}/api/users`).pipe(
      tap({
        next: (user: UserInterface) => {
          this.user = user;
          this.user$.next(this.user);
        },
        complete: () => {this.setUserLoader = !this.userLoader},
      }),
      catchError(this.httpService.handleError),
    )
  }

  receiveRecommended(): Observable<UserInterface[]> {
    this.setUserLoader = !this.userLoader;
    return this.http.get<UserInterface[]>(`${this.configUrl}/api/users/recommended`).pipe(
      take(1),
      tap({
        next: (users: UserInterface[]) => {this.setRecommended = users },
        complete: () => this.setUserLoader = !this.userLoader,
      }),
      catchError(this.httpService.handleError)
    )
  }

  exceptRequest (index: number) {
    this.setUserLoader = !this.userLoader;
    return this.getUser.pipe(
      take(1),
      tap({
        next: (user: UserInterface) => {
          this.user.suggest.splice(index,1);
          this.user$.next(this.user);
        },
        complete: () => this.setUserLoader = !this.userLoader,
      }),
      catchError(this.httpService.handleError),
    )
  }

  findSuggest(suggestID: string) {
    return from([this.user.suggest.findIndex(( friend: FriendsInterface ) => friend.id === suggestID)]);
  }

  get getUser(): Observable<UserInterface> {
    return this.user$.asObservable();
  }

  get getUserLoader(): Observable<boolean> {
    return this.userLoader$.asObservable();
  }

  get getRecommended(): Observable<UserInterface[]> {
    return this.recommended$.asObservable();
  }

  set setRecommended(users: UserInterface[]) {
    this.recommended = users;
    this.recommended$.next(this.recommended);
  }

  set setUser(user: UserInterface) {
    this.user = user;
    this.user$.next(this.user);
  }

  set setUserLoader(bool: boolean) {
    this.userLoader = bool;
    this.userLoader$.next(this.userLoader);
  }
}
