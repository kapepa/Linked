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

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  getOwnProfile(): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${this.configUrl}/api/users`).pipe(
      tap((user: UserInterface) => {
        this.user = user;
        this.user$.next(this.user);
      }),
      catchError(this.httpService.handleError),
    )
  }

  exceptRequest (index: number) {
    return this.getUser.pipe(
      take(1),
      tap((user: UserInterface) => {
        this.user.suggest.splice(index,1);
        this.user$.next(this.user);
      })
    )
  }

  findSuggest(suggestID: string) {
    return from([this.user.suggest.findIndex(( friend: FriendsInterface ) => friend.id === suggestID)]);
  }

  get getUser(): Observable<UserInterface> {
    return this.user$.asObservable();
  }
}
