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

  confirm(friendID: string, userDto: UsersDto): Observable<UsersInterface> {
    return this.findOne({
      where: { user : { id: friendID }, friends: { id: userDto.id }},
      relations: ['user', 'user.friends', 'user.chat', 'user.request', 'friends', 'friends.friends', 'friends.chat', 'friends.suggest',]
    }).pipe(
      switchMap((friendsDto: FriendsInterface) => {
        let { user, friends } = friendsDto;

        if (friends.friends.some((profile: UsersInterface) => profile.id === user.id))
          throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);

        return of(userDto as UsersInterface).pipe(
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
                    person[userDto.id !== person.id ? 'request' : 'suggest'].filter((fr: FriendsInterface) => fr.id !== friendsDto.id);
                    person.friends.push(takeFriend);
                    this.usersService.saveUser(person).subscribe()

                    return takeUser(person)
                  }),
                  toArray(),
                  switchMap((users: UsersInterface[]) => {
                    let [user, friend] = users;
                    chat.conversation.push(takeUser(user), takeUser(friend));

                    return this.chatService.saveChat(chat).pipe(
                      switchMap(() => this.deleteRequest(friendsDto.id).pipe(
                          tap(() => this.friendsGateway.changeFriendSuggest(user.id, friend.id))
                        )
                      )
                    )
                  })
                )
              })
            ).subscribe()
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
    return of([]).pipe(
      tap(() => {
        this.chatService.findOneChat({
          where: { conversation: [{ id: friendID }, { id: user.id }] },
          relations: ['conversation', 'conversation.friends'],
        })
          .pipe(
            tap(() => {
              this.chatService.deleteChat(user.id, friendID).subscribe((del) => {
                this.friendsGateway.deleteFriendSuggest( friendID, user.id );
              })
            })
          )
          .subscribe(
          (chat: ChatInterface) => {
            from(chat.conversation)
              .pipe(
                map((person: UsersInterface) => {
                  let excludeID = person.id === friendID ? user.id : friendID;
                  person.friends = person.friends.filter(( user: UsersInterface ) => user.id !== excludeID);
                  this.usersService.saveUser(person).subscribe();
                })
              ).subscribe()
          }
        )
      })
    )
  }

  deleteRequest(requestID: string): Observable<DeleteResult>{
    return from(this.friendsRepository.delete({id: requestID}));
  }
}
