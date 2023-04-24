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
    return this.findOneFriend({
      where: { user : { id: friendID }, friends: { id: userDto.id }},
      relations: ['user', 'user.friends', 'user.chat',  'user.request', 'friends', 'friends.friends', 'friends.chat', 'friends.suggest',]
    }).pipe(
      switchMap((friendsDto: FriendsInterface) => {
        let { user, friends } = friendsDto;
        let appendFriend = userDto.id === user.id ? friends : user;

        if (friends.friends.some((profile: UsersInterface) => profile.id === user.id))
          throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);

        return of({user: userDto as UsersInterface, friend: {...appendFriend, request: []} }).pipe(
          tap(() => {
            let takeUser = (profile: UsersInterface): UsersInterface => {
              let { friends, chat, request, suggest, ...otherFriend } = profile;
              return otherFriend;
            }

            this.chatService.createChat().pipe(
              switchMap((chat: ChatInterface) => {
                return from([friendsDto.user, friendsDto.friends]).pipe(
                  map((person: UsersInterface) => {
                    let newFriend = userDto.id !== person.id ? friendsDto.friends : friendsDto.user;
                    let takeFriend = takeUser(newFriend);
                    let fieldName = userDto.id !== person.id ? 'request' : 'suggest';
                    person[fieldName].filter((fr: FriendsInterface) => fr.id !== friendsDto.id);
                    person.friends.push(takeFriend);
                    person.chat.push(chat);
                    chat.conversation.push(takeUser(person));

                    return person;
                  }),
                  toArray(),
                  switchMap((users: UsersInterface[]) => {
                    let [user, friend] = users;
                    this.friendsGateway.changeFriendSuggest(user.id, friends.id)
                    return this.usersService.saveUser(user).pipe(
                      switchMap(() => this.chatService.saveChat(chat).pipe(
                        switchMap(() => this.usersService.saveUser(friend)),
                      ))
                    )
                  }),
                )
              })
            ).subscribe(() => this.friendsGateway.changeFriendSuggest(user.id, friends.id));
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
    let delFriend = (userID, friendID) => this.usersService.findOneUser({where: {id: userID, chat: {conversation: {id: friendID}} }, relations: ['friends', 'chat',]}).pipe(
      switchMap((profile: UsersInterface) => {
        let friendIndex = profile.friends.findIndex(p => p.id === userDto.id);
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
