import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {PersonService} from "../service/person.service";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PersonResolver implements Resolve<boolean> {
  constructor(private personService: PersonService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.personService.getPerson(route.paramMap.get('id')).pipe(
      switchMap(() => of(true))
    )
  }
}
