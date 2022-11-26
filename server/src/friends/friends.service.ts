import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersDto } from "../users/users.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";
import { DeleteResult, Repository } from "typeorm";
import {from, map, Observable, of, switchMap, tap, toArray} from "rxjs";
import { filter } from 'rxjs/operators';
import { UsersService } from "../users/users.service";
import { UsersInterface } from "../users/users.interface";
import { FriendsInterface } from "./friends.interface";
import { ChatService } from "../chat/chat.service";
import { FriendsGateway } from "./friends.gateway";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsEntity)
    private friendsRepository: Repository<FriendsEntity>,
    private usersService: UsersService,
    private chatService: ChatService,
    private friendsGateway: FriendsGateway,
  ) {};

  findOne(options: { where?: {[key: string]: string | { [key: string]: string } }, relations?: string[], }): Observable<FriendsInterface> {
    return from(this.friendsRepository.findOne(options));
  }

  findAll(options: { where?: {[key: string]: string | {[key: string]: string}}, relations?: string[], }): Observable<FriendsInterface[]> {
    return from(this.friendsRepository.find(options));
  }

  create(friendsID: string, user: UsersDto): Observable<FriendsInterface> {
    const { iat, exp, ...myUser } = user
    return this.usersService.findOne('id', friendsID).pipe(
      switchMap((friend: UsersInterface) => {
        if (!friend) throw new HttpException('Not found friends', HttpStatus.NOT_FOUND)
        return this.findOne({where: { 'friends': {'id': friendsID} }, relations: ['friends'] }).pipe(
          switchMap(( existFriends: FriendsInterface ) => {
            if(!!existFriends) throw new HttpException('Your request already exists', HttpStatus.BAD_REQUEST);

            return from(this.friendsRepository.save({ user: myUser, friends: friend }));
          })
        )
      }),
      tap(() => {
        this.usersService.findOne('id', friendsID).subscribe((friend: UsersInterface) => {
          this.chatService.createChat(user, friend).subscribe(() => {
            this.friendsGateway.notificationAddFriend(friendsID, user.id);
          });
        })
      })
    );
  }

  suggest(userID): Observable<FriendsInterface[]> {
    return this.usersService.findOne('id', userID, { relations: ['request', 'request.user'] }).pipe(
      switchMap((user: UsersInterface) => {
        if(!user.request) return of([]);
        return from(user.request).pipe(
          switchMap((friends: FriendsInterface) => {
            let {id} = friends.user;
            return of({...friends, user: {id}});
          }),
          toArray(),
        )
      }),
    );
  }

  confirm(requestID: string, user: UsersDto): Observable<UsersInterface> {
    return this.usersService.findOne('id', user.id, { relations: ['friends'] }).pipe(
      switchMap((person: UsersInterface) => {
        return this.findOne({where: {id: requestID}, relations: ['user', 'friends']}).pipe(
          switchMap((friend: FriendsInterface) => {
            if(user.id !== friend.friends.id) throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);
            return this.usersService.findOne('id', friend.user.id, { relations: ['friends'] } ).pipe(
              switchMap((profile: UsersInterface ) => {
                if(profile.friends.some( prof => prof.id === person.id )) throw new HttpException('Such a friend is already in friends', HttpStatus.BAD_REQUEST)
                profile.friends.push({id: friend.friends.id} as UsersInterface);
                person.friends.push(profile);

                return this.usersService.saveUser(person).pipe(
                  switchMap(() => {
                    return this.usersService.saveUser(profile).pipe(
                      tap(this.deleteRequest(requestID))
                    )
                  }),
                  tap(() => {
                    this.friendsGateway.changeFriendSuggest(profile.id, user.id)
                  })
                )
              })
            )
          }),
        );
      })
    )
  }

  offer(id: string): Observable<FriendsInterface[]> {
    return this.usersService.findOne('id', id ,{relations: ['request']}).pipe(
      switchMap(( user: UsersInterface ) => {
        return of(user.request);
      })
    )
  }

  cancel(requestID: string, user: UsersDto): Observable<DeleteResult>{
    return this.findOne({where: {id: requestID}, relations: ['user', 'friends']}).pipe(
      switchMap((friend: FriendsInterface) => {
        if(!(user.id === friend.user.id || user.id === friend.friends.id)) throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);
        return this.deleteRequest(requestID).pipe(
          tap(() => {
            this.chatService.deleteChat(user.id, friend.id).subscribe();
          })
        );
      }),
    )
  }

  delFriend(friendID: string, user: UsersDto): Observable<UsersInterface[]> {
    return this.usersService.findOne('id', friendID, { relations: ['friends'] }).pipe(
      switchMap((person: UsersInterface) => {
        let newFriendsPerson = person.friends.filter(profile => user.id !== profile.id);
        return this.usersService.findOne('id', user.id, { relations: ['friends'] }).pipe(
          switchMap((profile: UsersInterface) => {
            let newFriendsProfile = person.friends.filter(profile => user.id !== profile.id);
            return of([]).pipe(
              tap(() => {
                this.usersService.saveUser({...profile, friends: newFriendsProfile}).subscribe(),
                this.usersService.saveUser({...person, friends: newFriendsPerson}).subscribe(() => {
                  this.chatService.deleteChat(user.id, friendID);
                  this.friendsGateway.deleteFriendSuggest(friendID,user.id)
                })
              })
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
