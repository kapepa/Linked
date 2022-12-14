import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonService } from "../../core/service/person.service";
import { UserInterface } from "../../core/interface/user.interface";
import { from, Subscription } from "rxjs";
import { AuthService } from "../../core/service/auth.service";
import { UserJwtDto } from "../../core/dto/user-jwt.dto";
import { filter, switchMap, tap } from "rxjs/operators";
import { FriendsInterface } from "../../core/interface/friends.interface";
import { UserService } from "../../core/service/user.service";
import { Router } from "@angular/router";
import { ChatService } from "../../core/service/chat.service";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit, OnDestroy {
  person: UserInterface;
  personSub: Subscription;

  user: UserJwtDto;
  userSub: Subscription;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private personService: PersonService,
  ) { }

  ngOnInit() {
    this.personSub = this.personService.personProfile.subscribe((person: UserInterface) => {this.person = person});
    this.userSub = this.authService.getUser.subscribe(( user: UserJwtDto ) => this.user = user);
  }

  ngOnDestroy() {
    this.personSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  onFriends() {
    this.personService.addFriends(this.person.id).subscribe(() => {});
  }

  onConfirm() {
    from(this.person.request).pipe(
      filter((request: FriendsInterface ) => {
        return request.friends.id === this.user.id || request.user.id === this.user.id;
      }),
      switchMap((request: FriendsInterface) => {
        return this.personService.confirmFriends(this.person.id).pipe(
          tap(() => this.userService.findSuggest(request.id).subscribe((index: number) => {
            this.userService.exceptRequest(index).subscribe();
          })),
        );
      }),
    ).subscribe();
  }

  onDelete() {
    this.personService.deleteFriend(this.person.id).subscribe(() => {});
  }

  onOpenChatPerson(e: Event){
    e.preventDefault();
    this.chatService.setFirstUser(this.person.id).subscribe(() => {
      this.router.navigate(['/chat']);
    })
  }

  get getBtn() {
    let sign: 'ADD' | 'CONFIRM' | 'PENDING' | 'DELETE';
    switch (true) {
      case (!this.person?.suggest.length && !this.person?.request.length && !this.person?.friends.length) : return  sign = 'ADD';
      case (!!this.person?.request.length) : return sign = 'CONFIRM';
      case (!!this.person?.suggest.length): return sign = 'PENDING';
      case (!!this.person?.friends.length): return sign = 'DELETE';
      default: return  sign = 'ADD';
    }
  }

  get accessMessage() {
    return this.person.friends.some((user: UserInterface) => user.id === this.user.id);
  }

}
