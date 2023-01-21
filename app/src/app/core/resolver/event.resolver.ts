import {Injectable} from '@angular/core';
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
export class EventResolver implements Resolve<boolean> {
  constructor(
    private eventService: EventService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.eventService.oneEvent(route.params.id).pipe(
      switchMap((event: EventInterface) => {
        if(!!event) return of(true);
        return of(false);
      })
    )
  }
}
