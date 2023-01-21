import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventInterface} from "../../core/interface/event.interface";
import {Subscription} from "rxjs";
import {EventService} from "../../core/service/event.service";

@Component({
  selector: 'app-event-detailed',
  templateUrl: './event-detailed.component.html',
  styleUrls: ['./event-detailed.component.scss'],
})
export class EventDetailedComponent implements OnInit, OnDestroy {
  addition: 'common' | 'comment' = 'common';
  monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

  event: EventInterface;
  eventSub: Subscription;

  constructor(
    private eventService: EventService,
  ) { }

  ngOnInit() {
    this.eventSub = this.eventService.getEvent.subscribe((event: EventInterface) => this.event = event);

    console.log(new Date(this.event.date).getMonth())
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  onAddition(addition: 'common' | 'comment' ) {
    this.addition = addition;
  }

  get getDate() {
    return new Date(this.event.date);
  }

  get getDateMeeting() {
    return `${this.getDate.getDate()} ${this.monthNames[this.getDate.getMonth()]} ${this.getDate.getFullYear()}`
  }
}
