import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersDto } from "../users/users.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";
import { DeleteResult, Repository } from "typeorm";
import {from, Observable, ObservedValueOf, of, switchMap, tap, toArray} from "rxjs";
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
    return this.findOne({
      where: {id: requestID},
      relations: ['user', 'user.friends', 'user.chat',  'friends', 'friends.friends', 'friends.chat']
    }).pipe(
      switchMap((friendsDto: FriendsInterface) => {
        let { user, friends } = friendsDto;

        if (friends.friends.some((profile: UsersInterface) => profile.id === user.id))
          throw new HttpException('Something went wrong with friend', HttpStatus.BAD_REQUEST);

        return from([{...friendsDto.friends, friends: [friendsDto.user], request: []}]).pipe(
          tap(() => {
            this.chatService.createChat().subscribe((chat: ChatInterface) => {

              from([friendsDto.user, friendsDto.friends])
                .pipe(
                  tap(() => {
                    this.deleteRequest(requestID).subscribe(() => this.friendsGateway.changeFriendSuggest(friendsDto.user.id, friendsDto.friends.id))
                  })
                )
                .subscribe(( person: UsersInterface ) => {
                let newFriend = friendsDto.user.id === userDto.id ? friendsDto.friends : friendsDto.user;
                let {friends, ...otherFriend} = newFriend;
                person.friends.push(otherFriend);
                person.chat.push(chat);

                this.usersService.saveUser(person).subscribe(() => {
                  chat.conversation.push(person)
                  this.chatService.saveChat(chat)
                })
              })


              // let { conversation, ...otherChat } = chat;
              // let { friends, ...otherFriend } = friendsDto.friends;
              //
              // this.usersService.findOneUser({ where: { id: otherFriend.id }, relations: ['chat', 'friends'] }).subscribe((fr: UsersInterface) => {
              //   fr.friends.push(user);
              //   fr.chat.push(otherChat);
              //   // console.log(fr.chat)
              //   this.usersService.saveUser(fr).subscribe((re) => console.log(re.chat));
              // })
              //
              // this.usersService.findOneUser({ where: { id: user.id }, relations: ['chat', 'friends'] }).subscribe((us: UsersInterface) => {
              //   us.friends.push(otherFriend);
              //   us.chat.push(otherChat);
              //   // console.log(us.chat)
              //   this.usersService.saveUser(us).subscribe((re) => {
              //     console.log(re.chat)
              //     this.deleteRequest(requestID).subscribe(() => this.friendsGateway.changeFriendSuggest(user.id, otherFriend.id))
              //   })
              // })

              // from([
              //   this.usersService.findOneUser({ where: { id: otherFriend.id }, relations: ['chat', 'friends'] }),
              //   this.usersService.findOneUser({ where: { id: user.id }, relations: ['chat', 'friends'] })
              // ])
              //   .pipe(
              //     tap(() => {
              //       this.deleteRequest(requestID).subscribe(() => this.friendsGateway.changeFriendSuggest(user.id, otherFriend.id))
              //     })
              //   )
              //   .subscribe((fn) => {
              //   fn.subscribe((person: UsersInterface) => {
              //     person.friends.push(person.id === user.id ? otherFriend : user);
              //     person.chat.push(otherChat);
              //     this.usersService.saveUser(person).subscribe(() => {
              //       chat.conversation.push(person);
              //       this.chatService.saveChat(chat);
              //     });
              //   })
              // })

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
    return of([]).pipe(
      tap(() => {

        this.chatService.findOneChat({
          where: { conversation: [{ id: friendID }, { id: user.id }] },
          relations: ['conversation', 'conversation.friends'],
        })
          .pipe(
            tap(() => {
              this.chatService.deleteChat(user.id, friendID).subscribe(() => {
                this.friendsGateway.deleteFriendSuggest( friendID, user.id );
              })
            })
          )
          .subscribe(
          (chat: ChatInterface) => {
            from(chat.conversation).subscribe(( person: UsersInterface ) => {
              let excludeID = person.id === friendID ? user.id : friendID;
              person.friends = person.friends.filter(( user: UsersInterface ) => user.id !== excludeID);
              this.usersService.saveUser(person).subscribe();
            })
          }
        )

        // this.usersService.findOneUser({ where: {id: user.id }, relations: ['friends'] }).subscribe((us: UsersInterface) => {
        //   us.friends = us.friends.filter(profile => profile.id !== friendID);
        //   this.usersService.saveUser(us).subscribe();
        // })
        //
        // this.usersService.findOneUser({ where: { id: friendID }, relations: ['friends'] }).subscribe((fr: UsersInterface) => {
        //   fr.friends = fr.friends.filter(profile => profile.id !== user.id);
        //   this.usersService.saveUser(fr).subscribe(() => {
        //     this.chatService.deleteChat(user.id, friendID).subscribe(() => {
        //       this.friendsGateway.deleteFriendSuggest( friendID, user.id );
        //     })
        //   });
        // })
      })
    )
  }

  deleteRequest(requestID: string): Observable<DeleteResult>{
    return from(this.friendsRepository.delete({id: requestID}));
  }
}
