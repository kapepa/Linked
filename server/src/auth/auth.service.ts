import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { UsersService } from "../users/users.service";
import {from, map, Observable, switchMap, tap} from "rxjs";
import * as bcrypt from "bcrypt";
import { config } from "dotenv";
import {UsersDto} from "../users/users.dto";
import {UsersInterface} from "../users/users.interface";
import {User} from "../users/users.entity";
import {Role} from "./role.enum";

config();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService
  ) {}

  validateUser(email: string, pass: string): Observable<any> {
    let select = ['id', 'firstName', 'lastName', 'email', 'password', 'role']
    return from(this.usersService.findOne('email', email, {select})).pipe(
      switchMap((user: UsersInterface) => {
        return this.comparePassword(pass, user.password).pipe(
          map((bol: boolean) => {
            return bol ? user : null
          })
        )
      })
    )
  }

  registrationUser(body: UsersDto): Observable<boolean> {
    return from(this.usersService.existUser('email', body.email)).pipe(
      switchMap((exist: boolean) => {
        if(exist) throw new HttpException('This email already exists', HttpStatus.CONFLICT)
        return this.hashPassword(body.password).pipe(
          switchMap((password: string) => {
            return this.usersService.createUser({...body, password}).pipe(
              map((user: UsersInterface) => user.id ? !!user.id : false)
            )
          })
        )
      })
    )
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT))).pipe(
      map((hash: string) => {
        if(!hash.trim()) throw new HttpException('There was an error creating the password hash', HttpStatus.BAD_REQUEST);
        return hash;
      })
    );
  }

  comparePassword(password: string, hash: string): Observable<boolean>{
    return from(bcrypt.compare(password, hash)).pipe(
      map( res => !!res )
    )
  }
}
