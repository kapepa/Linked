import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpService } from "./http.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { catchError, take, tap } from "rxjs/operators";
import { FriendsInterface } from "../interface/friends.interface";
import { UserInterface } from "../interface/user.interface";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  httpUrl = environment.configUrl;
  person: UserInterface;
  person$: BehaviorSubject<UserInterface> = new BehaviorSubject<UserInterface>(null);

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private httpService: HttpService,
  ) { }

  getPerson(personID): Observable<UserInterface>{
    return this.http.get<UserInterface>(`${this.httpUrl}/api/users/person/${personID}`).pipe(
      take(1),
      tap((person: UserInterface) => {
        this.person = person;
        this.person$.next(this.person);
        console.log(person)
      }),
      catchError(this.httpService.handleError),
    )
  }

  addFriends(friendID: string): Observable<FriendsInterface> {
    return this.http.post<FriendsInterface>(`${this.httpUrl}/api/friends/add/${friendID}`,{}).pipe(
      take(1),
      tap((friends: FriendsInterface) => {
        this.person.suggest.push(friends);
        this.person$.next(this.person);
      }),
      catchError(this.httpService.handleError),
    )
  }

  confirmFriends(friendID: string): Observable<UserInterface>{
    return this.http.put<UserInterface>(`${this.httpUrl}/api/friends/confirm/${friendID}`,{}).pipe(
      take(1),
      tap((person: UserInterface) => {
        if(!!this.person && this.person.request.some((request: FriendsInterface) => request.id === friendID)) {
          this.person.request = [];
          this.person.friends.push(person);
          this.person$.next(this.person);
        }
      }),
      catchError(this.httpService.handleError)
    )
  }

  cancelFriend(friendID: string): Observable<any> {
    return this.http.delete(`${this.httpUrl}/api/friends/cancel/${friendID}`).pipe(
      take(1),
      tap((friends: FriendsInterface[]) => {
        this.person.request = friends;
        this.person$.next(this.person);
      }),
      catchError(this.httpService.handleError),
    )
  }

  deleteFriend(friendID: string): Observable<UserInterface[]>{
    return this.http.delete<UserInterface[]>(`${this.httpUrl}/api/friends/delete/${friendID}`).pipe(
      take(1),
      tap((friends: UserInterface[]) => {
        this.person.friends = friends;
        this.person$.next(this.person);
      }),
      catchError(this.httpService.handleError)
    )
  }

  get personProfile() {
    return this.person$.asObservable()
  }
}
