import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot, Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from "../service/user.service";
import {switchMap, take} from "rxjs/operators";
import { UserInterface } from "../interface/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.getUser.pipe(
      take(1),
      switchMap((user: UserInterface) => {
        if(!!user) return of(true);
        return this.userService.getOwnProfile().pipe(
          switchMap((user: UserInterface) => {
            if(!user) return this.router.navigate(['/auth','login']);

            return of(!!user)
          }),
        )
      }),
    )
  }
}
