import {Component, Input, OnInit} from '@angular/core';
import {EventInterface} from "../../core/interface/event.interface";

@Component({
  selector: 'app-board-events',
  templateUrl: './board-events.component.html',
  styleUrls: ['./board-events.component.scss'],
})
export class BoardEventsComponent implements OnInit {
  @Input('title') title: string;
  @Input('events') events: EventInterface[];

  constructor() { }

  ngOnInit() {}

}
