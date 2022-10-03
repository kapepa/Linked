import { Injectable } from '@nestjs/common';
import {from, map, Observable, switchMap, tap} from "rxjs";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {UsersDto} from "./users.dto";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(key: string, val: string, additional?: { relations?: [], select?: [] } ) {
    return from(this.usersRepository.findOne({ where: { [key]: val }, ...additional, })).pipe(
      tap(user => console.log(user))
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
