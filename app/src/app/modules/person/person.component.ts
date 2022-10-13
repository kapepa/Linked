import { Component, OnInit, OnDestroy } from '@angular/core';
import {PersonService} from "../../core/service/person.service";
import {UserInterface} from "../../core/interface/user.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit, OnDestroy {
  person: UserInterface;
  personSub: Subscription;

  constructor(
    private personService: PersonService,
  ) { }

  ngOnInit() {
    this.personSub = this.personService.person.subscribe((person: UserInterface) => this.person = person);
  }

  ngOnDestroy() {
    this.personSub.unsubscribe();
  }

}
