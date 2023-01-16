import { environment } from "../../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { EventDto } from "../dto/event.dto";
import { catchError, take, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  configUrl = environment.configUrl;

  eventLoader: boolean;
  eventLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  createEvent(event: EventDto): Observable<any> {
    this.setEventLoader = !this.eventLoader;
    return this.http.post<any>(`${this.configUrl}/event/create`,event).pipe(
      take(1),
      tap({
        next: (res: any) => console.log(res),
        complete: () => this.setEventLoader = !this.eventLoader,
      }),
      catchError(this.httpService.handleError),
    );
  }

  get getEventLoader () {
    return this.eventLoader$.asObservable();
  }

  set setEventLoader (bool: boolean) {
    this.eventLoader = bool;
    this.eventLoader$.next(this.eventLoader);
  }
}
