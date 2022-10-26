import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable, of, switchMap } from "rxjs";
import { UsersInterface } from "../users/users.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  validate(email: string, password: string): Observable<UsersInterface> {
    return this.authService.validateUser(email, password).pipe(
      switchMap((user: UsersInterface | null ) => {
        if (!user) throw new UnauthorizedException();
        return of(user);
      })
    )

    // return of({} as UsersInterface)
    // return from(this.authService.validateUser(email, password)).pipe(
    //   map((user) => {
    //       if (!user) throw new UnauthorizedException();
    //       return user;
    //   })
    // );
  }
}