import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersDto } from "../users/users.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";
import { DeleteResult, Repository } from "typeorm";
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
    console.log(friendsID)
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
                      switchMap(() => this.usersService.saveUser(friend).pipe(
                        switchMap(() => this.chatService.saveChat(chat).pipe(
                          switchMap(() => this.deleteRequest(friendsDto.id)),
                        )),
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
            this.chatService.deleteChat(user.id, friend.id).subscribe();
            this.friendsGateway.declineFriend(friend.user.id, friend.friends.id);
          }),
        );
      }),
    )
  }

  delFriend(friendID: string, userDto: UsersDto): Observable<UsersInterface[]> {
    return of([]).pipe(
      tap(() => {
        this.chatService.findOneChat({where: { conversation: { id: friendID, friends: { id: userDto.id } } }}).pipe(
          switchMap((chatDto: ChatInterface) => {
            return this.chatService.findOneChat({
              where: {id: chatDto.id},
              relations: ['conversation.friends', 'conversation.chat', 'chat', 'conversation', ],
            }).pipe(
              switchMap((chat: ChatInterface) => {
                let [user, friend] = chat.conversation;

                return this.chatService.deleteChatAndMessage(chat).pipe(
                  switchMap(() => {
                    user.friends = user.friends.filter((person: UsersInterface) => person.id !== friend.id);
                    user.chat = user.chat.filter((ch: ChatInterface) => ch.id !== chat.id);

                    return this.usersService.saveUser(user).pipe(
                      switchMap(() => {
                        friend.friends = friend.friends.filter((person: UsersInterface) => person.id !== user.id);
                        friend.chat = friend.chat.filter((ch: ChatInterface) => ch.id !== chat.id);

                        return this.usersService.saveUser(friend).pipe(
                          tap(() => {
                            let toUser = userDto.id !== user.id ? user.id: friend.id;
                            let toFriend = userDto.id === user.id ? user.id: friend.id;

                            this.friendsGateway.deleteFriendSuggest( toUser, toFriend );
                          })
                        )
                      })
                    )
                  })
                )
              })
            )
          })
        ).subscribe()
      })
    )
  }

  deleteRequest(requestID: string): Observable<DeleteResult>{
    return from(this.friendsRepository.delete({id: requestID}));
  }
}
