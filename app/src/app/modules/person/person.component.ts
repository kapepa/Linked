import { Component, OnInit, OnDestroy } from '@angular/core';
import {PersonService} from "../../core/service/person.service";
import {UserInterface} from "../../core/interface/user.interface";
import {BehaviorSubject, Subscription} from "rxjs";
import {person} from "ionicons/icons";
import {AuthService} from "../../core/service/auth.service";
import {UserJwtDto} from "../../core/dto/user-jwt.dto";
import {Event} from "@angular/router";

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
    this.personSub = this.personService.personProfile.subscribe((person: UserInterface) => this.person = person);
    this.userSub = this.authService.getUser.subscribe(( user: UserJwtDto ) => this.user = user);
  }

  ngOnDestroy() {
    this.personSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  onFriends() {
    this.personService.addFriends(this.person.id).subscribe(() => {})
  }

  onCancel() {

  }

}
