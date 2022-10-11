import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {from, map, Observable, of, switchMap, tap} from "rxjs";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersDto } from "./users.dto";
import { UsersInterface } from "./users.interface";
import { FileService } from "../file/file.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private fileService: FileService,
  ) {}

  findOne(key: string, val: string, additional?: { relations?: string[], select?: string[] } ) {
    return from(this.usersRepository.findOne({ where: { [key]: val }, ...additional as {} })).pipe(
      switchMap((user: UsersInterface) => (of(user)))
    );
  }
  
  updateUser(key: string, val: string, data: UsersDto): Observable<any> {
    return from(this.usersRepository.update({[key]: val}, data));
  }

  createUser(userDto: UsersDto): Observable<any> {
    return from(this.usersRepository.save(userDto));
  };

  existUser(key: string, val: string): Observable<any> {
    return from(this.usersRepository.findOne({ where:{ [key]: val } })).pipe(
      map((user: UsersDto) => !!user)
    );
  }

  avatarUser(file: Express.Multer.File, user: UsersDto): Observable<{access_token: string}> {
    let updateUser = () => {
      return from(this.updateUser('id', user.id, {avatar: file.filename})).pipe(
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
}
