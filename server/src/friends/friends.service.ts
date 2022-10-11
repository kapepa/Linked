import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { UsersDto } from "../users/users.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";
import { Repository } from "typeorm";
import {from, of, switchMap} from "rxjs";
import {UsersService} from "../users/users.service";
import {UsersInterface} from "../users/users.interface";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsEntity)
    private usersRepository: Repository<FriendsEntity>,
    private usersService: UsersService,
  ) {}

  create(friendsID: string, user: UsersDto) {
    return this.usersService.findOne('id', friendsID).pipe(
      switchMap((friend: UsersInterface) => {
        if (!friend) throw new HttpException('Not found friends', HttpStatus.NOT_FOUND)
        // this.usersRepository.save({ user })
        console.log(friend)
        return of('asdas')
      })
    );
  }


}
