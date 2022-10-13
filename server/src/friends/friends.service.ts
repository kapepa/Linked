import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersDto } from "../users/users.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";
import { DeleteResult, Repository } from "typeorm";
import { from, Observable, of, switchMap, tap, toArray } from "rxjs";
import { filter } from 'rxjs/operators';
import { UsersService } from "../users/users.service";
import { UsersInterface } from "../users/users.interface";
import { FriendsInterface } from "./friends.interface";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsEntity)
    private friendsRepository: Repository<FriendsEntity>,
    private usersService: UsersService,
  ) {}

  findOne(options: { where?: {[key: string]: string | { [key: string]: string } }, relations?: string[], }): Observable<FriendsInterface> {
    return from(this.friendsRepository.findOne(options))
  }

  findAll(options: { where?: {[key: string]: string | {[key: string]: string}}, relations?: string[], }): Observable<FriendsInterface[]> {
    return from(this.friendsRepository.find(options))
  }

  create(friendsID: string, user: UsersDto): Observable<FriendsInterface> {
    const { iat, exp, ...myUser } = user
    return this.usersService.findOne('id', friendsID).pipe(
      switchMap((friend: UsersInterface) => {
        if (!friend) throw new HttpException('Not found friends', HttpStatus.NOT_FOUND)
        return this.findOne({where: { 'friends': {'id': friendsID} }, relations: ['friends'] }).pipe(
          switchMap(( existFriends: FriendsInterface ) => {
            if(!!existFriends) throw new HttpException('Your request already exists', HttpStatus.BAD_REQUEST)
            return from(this.friendsRepository.save({ user: myUser, friends: friend }));
          })
        )
      })
    );
  }

  suggest(userID): Observable<FriendsInterface[]> {
    return this.usersService.findOne('id', userID, { relations: ['request', 'request.user'] }).pipe(
      switchMap((user: UsersInterface) => {
        if(!user.request) return of([])
        return from(user.request).pipe(
          switchMap((friends: FriendsInterface) => {
            let {id} = friends.user;
            return of({...friends, user: {id}})
          }),
          toArray()
        )
      }),
    );
  }

  confirm(requestID: string, user: UsersDto): Observable<any>{
    return this.findOne({where: {id: requestID}, relations: ['user', 'friends']}).pipe(
      switchMap((friend: FriendsInterface) => {
        if(user.id !== friend.friends.id) throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);

        return this.usersService.findOne('id', friend.user.id, { relations: ['friends'] } ).pipe(
          switchMap((profile: UsersInterface ) => {
            if(profile.friends.some( prof => prof.id === friend.user.id)) throw new HttpException('Such a friend is already in friends', HttpStatus.BAD_REQUEST)
            profile.friends.push({id: friend.user.id} as UsersInterface)

            return this.usersService.saveUser(profile).pipe(
              tap(this.deleteRequest(requestID))
            )
          })
        )
      }),
    );
  }

  offer(user: UsersDto): Observable<FriendsInterface[]> {
    return this.usersService.findOne('id', user.id ,{relations: ['request']}).pipe(
      switchMap(( user: UsersInterface ) => {
        return of(user.request);
      })
    )
  }

  cancel(requestID: string, user: UsersDto): Observable<DeleteResult>{
    return this.findOne({where: {id: requestID}, relations: ['user', 'friends']}).pipe(
      switchMap((friend: FriendsInterface) => {
        if(user.id !== friend.id) throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);
        return this.deleteRequest(requestID);
      })
    )
  }

  delFriend(friendID: string, user: UsersDto): Observable<UsersInterface[]> {
    return this.usersService.findOne('id', user.id, { relations: ['friends'] }).pipe(
      switchMap((profile: UsersInterface) => {
        if(!profile.friends || !profile.friends.length) return of([] as UsersInterface[]);
        return from(profile.friends).pipe(
          filter((person: UsersInterface) => person.id !== friendID),
          toArray(),
          switchMap(( friendList: UsersInterface[] ) => {
            return this.usersService.saveUser({ ...user, friends: friendList }).pipe(
              switchMap(() => of(friendList)),
            );
          }),
        )
      })
    )
  }

  deleteRequest(requestID: string): Observable<DeleteResult>{
    return from(this.friendsRepository.delete({id: requestID}));
  }
}
