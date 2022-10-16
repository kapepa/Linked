
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "../service/auth.service";
import {switchMap, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLogin.pipe(
      take(1),
      switchMap((login: boolean) => {
        if (login) return of(true);
        return this.authService.tokenExp.pipe(
          switchMap((toke: boolean) => {
            if(!toke) this.router.navigate(['/auth','login'])
            return of(toke);
          })
        );
      })
    );
  }

}
