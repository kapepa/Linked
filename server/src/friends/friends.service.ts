import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersDto } from "../users/users.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";
import {DeleteResult, In, Repository} from "typeorm";
import { from, Observable, of, switchMap, tap, toArray, map } from "rxjs";
import { UsersService } from "../users/users.service";
import { UsersInterface } from "../users/users.interface";
import { FriendsInterface } from "./friends.interface";
import { ChatService } from "../chat/chat.service";
import { FriendsGateway } from "./friends.gateway";
import { ChatInterface } from "../chat/chat.interface";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsEntity)
    private friendsRepository: Repository<FriendsEntity>,
    private usersService: UsersService,
    private chatService: ChatService,
    private friendsGateway: FriendsGateway,
  ) {};

  findOneFriend(options: { where?: {[key: string]: string | { [key: string]: string } }, relations?: string[], }): Observable<FriendsInterface> {
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

  confirm(friendID: string, userDto: UsersDto): Observable<{ user: UsersInterface, friend: UsersInterface }> {
    let userProps = (user: UsersInterface) => {
      let { friends, chat, suggest, request, ...profile} = user;
      return profile;
    }

    return this.findOneFriend({
      where: { user : { id: friendID }, friends: { id: userDto.id }},
      relations: ['user', 'user.friends', 'user.chat',  'user.request', 'friends', 'friends.friends', 'friends.chat', 'friends.suggest']
    }).pipe(
      switchMap((friendsDto: FriendsInterface) => {
        let { user, friends } = friendsDto;
        let userBase = userProps(user);
        let friendBase = userProps(friends);

        if (friends.friends.some((profile: UsersInterface) => profile.id === user.id))
          throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);

        return this.deleteRequest(friendsDto.id).pipe(
          switchMap(() => {
            return this.usersService.findOneUser({ where: {id: user.id}, relations: ['request'] }).pipe(
              switchMap((profile: UsersInterface) => {
                return from([{user: friends as UsersInterface, friend: profile }]).pipe(
                  tap(() => {
                    friends.friends.push(userBase);
                    user.friends.push(friendBase);

                    this.chatService.createChat({conversation: [user, friends]}).subscribe((chat: ChatInterface) => {
                      user.chat.push(chat);
                      friends.chat.push(chat);

                      this.usersService.saveUser(user).subscribe();
                      this.usersService.saveUser(friends).subscribe();
                      this.friendsGateway.changeFriendSuggest(user.id, friends.id);
                    })
                  })
                )
              })
            )
          })
        )
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
    return this.findOneFriend({where: {id: requestID}, relations: ['user', 'friends']}).pipe(
      switchMap((friend: FriendsInterface) => {
        if(!(user.id === friend.user.id || user.id === friend.friends.id)) throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);
        return from([[] as FriendsInterface[]]).pipe(
          tap(() => {
            this.deleteRequest(requestID).subscribe();
            // this.chatService.deleteChat(user.id, friend.id).subscribe();
            this.friendsGateway.declineFriend(friend.user.id, friend.friends.id);
          }),
        );
      }),
    )
  }

  delFriend(friendID: string, userDto: UsersDto): Observable<UsersInterface[]> {
    let delFriend = (userID, friendID) => this.usersService.findOneUser({
      where: {id: userID},
      relations: ['friends', 'chat', 'chat.conversation'],
    }).pipe(
      switchMap((profile: UsersInterface) => {
        let friendIndex = profile.friends.findIndex(p => p.id === friendID);
        profile.friends.splice(friendIndex, 1);

        return this.usersService.saveUser({...profile, friends: profile.friends})
      })
    )

    return delFriend(userDto.id, friendID).pipe(
      switchMap((ownProfile: UsersInterface | UsersDto) => {
        return delFriend(friendID, userDto.id).pipe(
          switchMap((friendProfile: UsersInterface | UsersDto) => {
            return of(friendProfile.friends).pipe(
              tap(() => {
                this.chatService.deleteChatAndMessage(friendProfile.chat[0]).subscribe();
                this.friendsGateway.deleteFriendSuggest( friendID, userDto.id );
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
