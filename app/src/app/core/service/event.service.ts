import { environment } from "../../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, from, Observable } from "rxjs";
import { EventDto } from "../dto/event.dto";
import { catchError, take, tap } from "rxjs/operators";
import { EventInterface } from "../interface/event.interface";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  configUrl = environment.configUrl;

  eventLoader: boolean;
  eventLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  event: EventInterface = {} as EventInterface;
  event$: BehaviorSubject<EventInterface> = new BehaviorSubject<EventInterface>({});

  events: EventInterface[] = [] as EventInterface[];
  events$: BehaviorSubject<EventInterface[]> = new BehaviorSubject<EventInterface[]>([] as EventInterface[]);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  inForm(obj: {[key: string]: any}) {
    return Object.keys(obj).reduce((form: FormData, key: string) => {
      form.append(key, obj[key]);
      return form;
    }, new FormData());
  }

  createEvent(event: EventDto): Observable<EventInterface> {
    let toForm = this.inForm(event);
    this.setEventLoader = !this.eventLoader;
    return this.http.post<EventInterface>(`${this.configUrl}/api/event/create`, toForm).pipe(
      take(1),
      tap({
        next: (event: EventInterface) => {},
        complete: () => this.setEventLoader = !this.eventLoader,
      }),
      catchError(this.httpService.handleError),
    );
  }

  oneEvent(id: string): Observable<EventInterface> {
    this.setEventLoader = !this.eventLoader;
    return this.http.get<EventInterface>(`${this.configUrl}/api/event/one/${id}`).pipe(
      take(1),
      tap({
        next: (event: EventInterface) => this.setEvent = event,
        complete: () => this.setEventLoader = ! this.eventLoader,
      }),
      catchError(this.httpService.handleError),
    )
  }

  listEvent(query?: {take?: number, skip?: number}): Observable<EventInterface[]> {
    this.setEventLoader = !this.eventLoader;
    return this.http.get<EventInterface[]>(`${this.configUrl}/api/event/list`, {
      params: query,
    }).pipe(
      take(1),
      tap({
        next: (events: EventInterface[]) => this.setEvents = events,
        complete: () => this.setEventLoader = !this.eventLoader,
      }),
      catchError(this.httpService.handleError),
    )
  }

  get getEventLoader () {
    return this.eventLoader$.asObservable();
  }

  get getEvents(): Observable<EventInterface[]> {
    return this.events$.asObservable();
  }

  get getEvent(): Observable<EventInterface> {
    return this.event$.asObservable();
  }

  set setEventLoader (bool: boolean) {
    this.eventLoader = bool;
    this.eventLoader$.next(this.eventLoader);
  }

  set setEvent(event: EventInterface) {
    this.event = event;
    this.event$.next(this.event);
  }

  set setEvents(events: EventInterface[]) {
    this.events.push(...events);
    this.events$.next(this.events);
  }
}
