import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersDto } from "../users/users.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";
import { DeleteResult, Repository } from "typeorm";
import { from, Observable, of, switchMap, tap, toArray } from "rxjs";
import { UsersService } from "../users/users.service";
import { UsersInterface } from "../users/users.interface";
import { FriendsInterface } from "./friends.interface";
import { ChatService } from "../chat/chat.service";
import { FriendsGateway } from "./friends.gateway";
import {ChatInterface} from "../chat/chat.interface";

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
    return this.usersService.findOneUser({ where: { id: friendsID }, relations: ['friends', 'suggest', 'request'] }).pipe(
      switchMap((friend: UsersInterface) => {
        let existFriend = friend.friends.some(( profile: UsersInterface ) => profile.id === user.id);
        if(!!existFriend) throw new HttpException('Your request already exists', HttpStatus.BAD_REQUEST);

        return from(this.usersService.findOneUser({ where: { id: user.id }, relations: ['friends', 'suggest', 'request'] }).pipe(
          switchMap((profile: UsersInterface) => {
            return from(this.friendsRepository.save({ user: profile, friends: friend })).pipe(
              tap((data) => {
                this.friendsGateway.notificationAddFriend(friendsID, user.id);
              })
            )
          })
        ))
      })
    )
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

  confirm(requestID: string, userDto: UsersDto): Observable<UsersInterface> {
    return this.findOne({
      where: {id: requestID},
      relations: ['friends', 'friends.chat', 'friends.suggest', 'friends.request', 'friends.friends', 'user', 'user.chat', 'user.suggest', 'user.request', 'user.friends',]
    }).pipe(
      switchMap((friendsDto: FriendsInterface) => {
        let { user, friends } = friendsDto;

        if (friends.friends.some((profile: UsersInterface) => profile.id === user.id)) throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);
        return from([{...friends, friends: [user], request: []}]).pipe(
          tap(() => {
            this.chatService.createChat(user, friends).subscribe((chat) => {
              let { conversation, ...otherChat } = chat
              // console.log(friends.chat)
              // console.log(user.chat)

              user.friends.push(friends);
              user.chat.push(otherChat);
              this.usersService.saveUser(user).subscribe((profile: UsersInterface) => {
                friends.friends.push(user);
                friends.chat.push(otherChat);

                console.log(friends.chat)
                this.usersService.saveUser(friends).subscribe((fr: UsersInterface) => {

                  console.log(fr.chat)
                  this.deleteRequest(requestID).subscribe(() => this.friendsGateway.changeFriendSuggest(user.id, friends.id))
                })
              })
            })
          })
        );
      }),
    )
  }

  offer(id: string): Observable<FriendsInterface[]> {
    return this.usersService.findOne('id', id ,{relations: ['request']}).pipe(
      switchMap(( user: UsersInterface ) => {
        return of(user.request);
      })
    )
  }

  cancel(requestID: string, user: UsersDto): Observable<FriendsInterface[]>{
    return this.findOne({where: {id: requestID}, relations: ['user', 'friends']}).pipe(
      switchMap((friend: FriendsInterface) => {
        if(!(user.id === friend.user.id || user.id === friend.friends.id)) throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);
        return from([[] as FriendsInterface[]]).pipe(
          tap(() => {
            this.deleteRequest(requestID).subscribe();
            this.chatService.deleteChat(user.id, friend.id).subscribe();
            this.friendsGateway.declineFriend(friend.user.id, friend.friends.id);
          }),
        );
      }),
    )
  }

  delFriend(friendID: string, user: UsersDto): Observable<UsersInterface[]> {
    return this.usersService.findOneUser({ where: { id: friendID }, relations: ['friends'] }).pipe(
      switchMap((friend: UsersInterface) => {
        return this.usersService.findOneUser({ where: {id: user.id}, relations: ['friends'] }).pipe(
          switchMap((profile: UsersInterface) => {
            // let clearFriend = JSON.parse(JSON.stringify(friend.friends.filter(( fr: UsersInterface ) => fr.id !== profile.id)));
            // let clearProfile = JSON.parse(JSON.stringify( profile.friends.filter(( fr: UsersInterface ) => fr.id !== friend.id)));
            profile.friends = profile.friends.filter(( fr: UsersInterface ) => fr.id !== friend.id);

            return of([]).pipe(
              tap(() => {
                this.usersService.saveUser(profile).subscribe((profileSave: UsersInterface) => {
                  friend.friends = friend.friends.filter(( fr: UsersInterface ) => fr.id !== profile.id);
                  this.usersService.saveUser(friend).subscribe(() => {
                    this.chatService.deleteChat(profile.id, friend.id).subscribe(() => {
                      this.friendsGateway.deleteFriendSuggest(friend.id, profile.id);
                    })
                  })
                })
                // this.chatService.deleteChat(profile.id, friend.id).subscribe(() => {
                //   this.usersService.saveUser({...profile, friends: clearProfile }).subscribe();
                //   this.usersService.saveUser({...friend, friends: clearFriend }).subscribe(() => {
                //     this.friendsGateway.deleteFriendSuggest(friend.id, profile.id);
                //   })
                // })
              })
            )
          })
        )
      })
    )
  }

  deleteRequest(requestID: string): Observable<DeleteResult>{
    return from(this.friendsRepository.delete({id: requestID}));
  }
}
