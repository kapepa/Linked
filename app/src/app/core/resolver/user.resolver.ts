import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from "../service/user.service";
import {switchMap} from "rxjs/operators";
import {UserInterface} from "../interface/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<boolean> {
  constructor(
    private userService: UserService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.getUser.pipe(
      switchMap((user: UserInterface) => {
        if(!!user) return of(true);
        return this.userService.getOwnProfile().pipe(
          switchMap((user: UserInterface) => of(!!user))
        )
      })
    )
  }
}
