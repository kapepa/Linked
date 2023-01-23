import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {EventService} from "../service/event.service";
import {switchMap} from "rxjs/operators";
import {EventInterface} from "../interface/event.interface";

@Injectable({
  providedIn: 'root'
})
export class EventsResolver implements Resolve<boolean> {
  constructor(
    private eventService:  EventService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.eventService.getEvents.pipe(
      switchMap((events: EventInterface[]) => {
        if(!!events.length) return of(true);
        return this.eventService.listEvent({take: 6, skip: 0}).pipe(
          switchMap((events: EventInterface[]) => of(true)),
        );
      })
    )
  }
}
