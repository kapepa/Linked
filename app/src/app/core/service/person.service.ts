import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpService} from "./http.service";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError, take, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  httpUrl = environment.configUrl;
  person$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  getPerson(personID): Observable<any>{
    return this.http.get<any>(`${this.httpUrl}/api/users/person/${personID}`).pipe(
      take(1),
      tap((person: any) => {
        this.person$.next(person);
      }),
      catchError(this.httpService.handleError),
    )
  }

  get person() {
    return this.person$.asObservable()
  }
}
