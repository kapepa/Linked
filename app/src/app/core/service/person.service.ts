import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpService} from "./http.service";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError, take, tap} from "rxjs/operators";
import {FriendsInterface} from "../interface/friends.interface";
import {UserInterface} from "../interface/user.interface";

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  httpUrl = environment.configUrl;
  person: UserInterface;
  person$: BehaviorSubject<UserInterface> = new BehaviorSubject<UserInterface>(null);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  getPerson(personID): Observable<UserInterface>{
    return this.http.get<UserInterface>(`${this.httpUrl}/api/users/person/${personID}`).pipe(
      take(1),
      tap((person: UserInterface) => {
        this.person = person;
        this.person$.next(this.person);
      }),
      catchError(this.httpService.handleError),
    )
  }

  addFriends(friendID: string): Observable<FriendsInterface> {
    return this.http.post<FriendsInterface>(`${this.httpUrl}/api/friends/add/${friendID}`,{}).pipe(
      take(1),
      tap((friends: FriendsInterface) => {
        this.person.request.push(friends);
        this.person$.next(this.person);
      }),
      catchError(this.httpService.handleError),
    )
  }

  confirmFriends(friendID: string): Observable<UserInterface>{
    return this.http.put<UserInterface>(`${this.httpUrl}/api/friends/confirm/${friendID}`,{}).pipe(
      take(1),
      tap((person: UserInterface) => {
        this.person.request = []
        this.person.friends.push(person);
        this.person$.next(this.person);
      }),
      catchError(this.httpService.handleError)
    )
  }

  get personProfile() {
    return this.person$.asObservable()
  }
}
