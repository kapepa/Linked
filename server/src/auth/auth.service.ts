import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { from, map, Observable, of, switchMap, tap } from "rxjs";
import * as bcrypt from "bcrypt";
import { UsersDto } from "../users/users.dto";
import { UsersInterface } from "../users/users.interface";
import { JwtService } from "@nestjs/jwt";
import {MailService} from "../mailer/mailer.service";
import { config } from "dotenv";
import {DeleteResult} from "typeorm";
import {ChatService} from "../chat/chat.service";

config();

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  validateUser(email: string, pass: string): Observable<UsersInterface | null> {
    let select = ['id', 'firstName', 'lastName', 'email', 'password', 'role', 'avatar'];

    return this.usersService.findOne('email', email, {select}).pipe(
      switchMap((user: UsersInterface) => {
        return this.comparePassword(pass, user.password).pipe(
          map((bol: boolean) => {
            return bol ? user : null;
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
            return this.usersService.saveUser({...body, password}).pipe(
              map((user: UsersInterface) => user.id ? !!user.id : false),
              tap(() => this.mailService.regUser(body).subscribe()),
            )
          })
        )
      })
    )
  }

  loginUser(user: Observable<UsersDto>): Observable<{access_token: string}> {
    return user.pipe(
      switchMap((user: UsersDto) => {
        let { firstName, lastName, id, role, avatar } = user;
        return of({access_token: this.jwtService.sign({firstName, lastName, id, role, avatar})});
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

  socialAuth(user: UsersDto | UsersInterface): Observable<{access_token: string}> {
    return this.usersService.findOneUser({ where: {email: user.email} }).pipe(
      tap((user: UsersInterface) => {
        if(!!user) return of(user);
        return this.usersService.saveUser(user);
      }),
      switchMap((user: UsersInterface) => {
        let { firstName, lastName, id, role, avatar } = user;
        return of({access_token: this.jwtService.sign({firstName, lastName, id, role, avatar})});
      })
    );
  }

  deleteMyself(user: UsersDto): Observable<DeleteResult> {
    return this.usersService.del(user.id)
  }
}
