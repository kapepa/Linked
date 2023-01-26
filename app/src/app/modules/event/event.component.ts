import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventService} from "../../core/service/event.service";
import {EventInterface} from "../../core/interface/event.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  events: EventInterface[];
  eventsSub: Subscription;

  constructor(
    private eventService: EventService,
  ) { }

  ngOnInit() {
    this.eventsSub = this.eventService.getEvents.subscribe((events: EventInterface[]) => this.events = events);
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }
}
