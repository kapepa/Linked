import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { from, map, Observable, of, switchMap, toArray } from "rxjs";
import { User } from "./users.entity";
import { DeleteResult, Not, Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersDto } from "./users.dto";
import { UsersInterface } from "./users.interface";
import { FileService } from "../file/file.service";
import { AuthService } from "../auth/auth.service";
import { filter } from "rxjs/operators";
import { FriendsInterface } from "../friends/friends.interface";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private fileService: FileService,
  ) {}

  findOne(key: string, val: string, additional?: { relations?: string[], select?: string[] } ): Observable<UsersInterface> {
    return from(this.usersRepository.findOne({ where: { [key]: val }, ...additional as {} })).pipe(
      switchMap((user: UsersInterface) => (of(user)))
    );
  }

  findOneUser(options?: {
    where?: {
      [key: string]: string | string[] | UsersInterface[] | UsersDto[] | { [key: string]: string | UsersDto | { [key: string]: string | UsersDto } }
    };
    relations?: string[];
    order?: {[key: string]: "ASC" | "DESC" | {[key: string]: "ASC" | "DESC" | {[key: string]: "ASC" | "DESC"}} };
    skip?: number;
    take?: number;
  }): Observable<UsersInterface> {
    return from(this.usersRepository.findOne({...options}));
  }

  findUsers(
    options?: {
      where: { [key:string] : string | number  } | { [key:string] : string | number }[] | any,
      relations?: string[],
      order?: { [key: string]: string | { [key: string]: string | {[key: string]: string}[] } }
    }) {
    return from(this.usersRepository.find({...options}));
  }
  
  updateUser(key: string, val: string, data: UsersDto | UsersInterface ): Observable<UpdateResult> {
    return from(this.usersRepository.update({[key]: val}, data));
  }

  existUser(key: string, val: string): Observable<boolean> {
    return from(this.usersRepository.findOne({ where:{ [key]: val } })).pipe(
      map((user: User) => !!user)
    );
  }

  existProfile(key: string, val: string): Observable<boolean> {
    return from(this.usersRepository.findOne({ where:{ [key]: val } })).pipe(
      switchMap((user: User) => of(!!user))
    );
  }

  saveUser(user: UsersDto | UsersInterface ): Observable<UsersInterface | UsersDto>{
    return from(this.usersRepository.save(user));
  }

  person(personID: string, user: UsersDto): Observable<UsersInterface> {
    return this.findOne('id', personID, { relations: ['request', 'friends', 'suggest', 'suggest.user', 'suggest.friends', 'request.user', 'request.friends'] }).pipe(
      switchMap((person: UsersInterface) => {
        return from(person.friends).pipe(
          filter((friend: UsersInterface) => friend.id === user.id),
          toArray(),
          switchMap((friends: UsersInterface[]) => {
            return from(person.request).pipe(
              filter((request: FriendsInterface) => (request?.user.id === user?.id || request.friends.id === user.id) ),
              toArray(),
              switchMap((request: FriendsInterface[]) => {
                return from(person.suggest).pipe(
                  filter((suggest: FriendsInterface) => (suggest.user.id === user.id || suggest.friends.id === user.id)),
                  toArray(),
                  switchMap((suggest: FriendsInterface[]) => {
                    return of({...person, friends, request, suggest })
                  })
                )
              })
            )
          })
        )
      })
    )
  }

  avatarUser(file: Express.Multer.File, user: UsersDto): Observable<{access_token: string}> {
    let updateUser = () => {
      return from(this.saveUser({...user, avatar: file.filename})).pipe(
        switchMap(() => {
          return this.authService.loginUser(of({...user, avatar: file.filename}));
        })
      )
    }

    return this.fileService.formFile(file.filename).pipe(
      switchMap((existFile: Boolean) => {
        if(!existFile) throw new HttpException('Your avatar has not been saved', HttpStatus.BAD_REQUEST);
        return this.findOne('id', user.id).pipe(
          switchMap((user: UsersInterface) => {
            if(user.avatar.trim()) return from(this.fileService.removeFile(user.avatar)).pipe(
              switchMap(updateUser)
            )
            return from(updateUser())
          })
        );
      })
    )
  }

  recommendedUsers(user: UsersDto): Observable<UsersInterface[]> {
    return from(this.usersRepository.find({where: {id: Not(user.id)}}));
  }

  del(userID: string): Observable<DeleteResult>{
    return from(this.usersRepository.delete({id: userID}));
  }
}
