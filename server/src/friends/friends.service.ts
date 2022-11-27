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
    const { iat, exp, ...myUser } = user;

    return this.usersService.findOneUser({ where: { id: friendsID }, relations: ['friends', 'suggest'] }).pipe(
      switchMap((friend: UsersInterface) => {
        let existFriend = friend.friends.some(( profile: UsersInterface ) => profile.id === myUser.id);

        if(!!existFriend) throw new HttpException('Your request already exists', HttpStatus.BAD_REQUEST);

        return from(this.usersService.findOneUser({ where: { id: user.id }, relations: ['request'] }).pipe(
          switchMap((profile: UsersInterface) => {
            return from(this.friendsRepository.save({ user: profile, friends: friend })).pipe(
              tap(() => {
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
    return this.findOne({where: {id: requestID}, relations: ['user', 'friends', 'user.request', 'user.friends', 'user.suggest', 'friends.friends']}).pipe(
      switchMap((friendsDto: FriendsInterface) => {
        let { user, friends } = friendsDto;

        if (user.friends.some((profile: UsersInterface) => profile.id === friends.id)) throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);
        // let userFriends = JSON.parse(JSON.stringify([...user.friends, friends]));
        let friendFriends = JSON.parse(JSON.stringify([...friends.friends, user]));

        // user.friends = userFriends;
        friends.friends = friendFriends


        return from([{...friends, friends: []}]).pipe(
          tap(() => {
            this.deleteRequest(requestID).subscribe(() => {
              // this.usersService.saveUser(user).subscribe();
              this.usersService.saveUser(friends).subscribe(() => {
                this.chatService.createChat(user, friends).subscribe(() => {
                  this.friendsGateway.changeFriendSuggest(user.id, friends.id);
                });
              });

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
                  this.chatService.deleteChat(user.id, friendID).subscribe(() => {
                    this.friendsGateway.deleteFriendSuggest(friendID,user.id);
                  });
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
