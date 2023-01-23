import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserService} from "../service/user.service";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RecommendedResolver implements Resolve<boolean> {
  constructor(
    private userService: UserService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.receiveRecommended().pipe(
      switchMap(() => of(true))
    );
  }
}
