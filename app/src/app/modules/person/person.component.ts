import { Component, OnInit, OnDestroy } from '@angular/core';
import {PersonService} from "../../core/service/person.service";
import {UserInterface} from "../../core/interface/user.interface";
import {BehaviorSubject, from, of, Subscription} from "rxjs";
import {person} from "ionicons/icons";
import {AuthService} from "../../core/service/auth.service";
import {UserJwtDto} from "../../core/dto/user-jwt.dto";
import {Event} from "@angular/router";
import {filter, switchMap} from "rxjs/operators";
import {FriendsInterface} from "../../core/interface/friends.interface";

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
    private personService: PersonService,
  ) { }

  ngOnInit() {
    // this.personSub = this.personService.personProfile.subscribe((person: UserInterface) => {this.person = person});
    // this.userSub = this.authService.getUser.subscribe(( user: UserJwtDto ) => this.user = user);
  }

  ngOnDestroy() {
    // this.personSub.unsubscribe();
    // this.userSub.unsubscribe();
  }

  onFriends() {
    this.personService.addFriends(this.person.id).subscribe(() => {})
  }

  onConfirm() {
    from(this.person.request).pipe(
      filter((request: FriendsInterface ) => {
        return request.friends.id === this.user.id || request.user.id === this.user.id
      }),
      switchMap((request: FriendsInterface) => {
        return this.personService.confirmFriends(request.id)
      })
    ).subscribe(() => {})
  }

  onDelete() {
    this.personService.deleteFriend(this.person.id).subscribe(() => {})
  }

}
