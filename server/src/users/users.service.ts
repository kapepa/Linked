import { Injectable } from '@nestjs/common';
import {from, map, Observable, of, switchMap, tap} from "rxjs";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersDto } from "./users.dto";
import { UsersInterface } from "./users.interface";
import {FileService} from "../file/file.service";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private fileService: FileService,
  ) {}

  findOne(key: string, val: string, additional?: { relations?: string[], select?: string[] } ) {
    return from(this.usersRepository.findOne({ where: { [key]: val }, ...additional as {} })).pipe(
      switchMap((user: UsersInterface) => (of(user)))
    )
  }

  createUser(userDto: UsersDto): Observable<any> {
    return from(this.usersRepository.save(userDto));
  }

  existUser(key: string, val: string): Observable<any> {
    return from(this.usersRepository.findOne({ where:{ [key]: val } })).pipe(
      map((user: UsersDto) => !!user)
    );
  }
}
