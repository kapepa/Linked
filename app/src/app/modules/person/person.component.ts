import { Component, OnInit, OnDestroy } from '@angular/core';
import {PersonService} from "../../core/service/person.service";
import {UserInterface} from "../../core/interface/user.interface";
import {from, Subscription} from "rxjs";
import {AuthService} from "../../core/service/auth.service";
import {UserJwtDto} from "../../core/dto/user-jwt.dto";
import {filter, switchMap, tap} from "rxjs/operators";
import {FriendsInterface} from "../../core/interface/friends.interface";
import {UserService} from "../../core/service/user.service";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit, OnDestroy {
  person: UserInterface;
  personSub: Subscription;

  user: UserJwtDto
  userSub: Subscription

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private personService: PersonService,
  ) { }

  ngOnInit() {
    this.personSub = this.personService.personProfile.subscribe((person: UserInterface) => {this.person = person; console.log(person)});
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
        return this.personService.confirmFriends(request.id);
      }),
      tap(() => {
        this.userService.getOwnProfile().subscribe();
      })
    ).subscribe(() => {})
  }

  onDelete() {
    this.personService.deleteFriend(this.person.id).subscribe(() => {});
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

}
