import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {from, map, Observable} from "rxjs";
import {UsersInterface} from "../users/users.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // async validate(email: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(email, password);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }

  validate(email: string, password: string): Observable<UsersInterface> {
    return from(this.authService.validateUser(email, password)).pipe(
      map((user) => {
          if (!user) {
            throw new UnauthorizedException();
          }
          return user;
      })
    );
  }
}