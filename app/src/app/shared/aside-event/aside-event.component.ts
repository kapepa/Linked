<<<<<<< HEAD
import {Component, Input, OnInit} from '@angular/core';
import {EventInterface} from "../../core/interface/event.interface";
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> origin

@Component({
  selector: 'app-aside-event',
  templateUrl: './aside-event.component.html',
  styleUrls: ['./aside-event.component.scss'],
})
export class AsideEventComponent implements OnInit {
<<<<<<< HEAD
  @Input('tapeEvent') tapeEvent: EventInterface[];
  monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];


  constructor() { }

  ngOnInit() {
  }

  eventWill(date, time: string) {
    let getDate = new Date(date);
    let dateNow = new Date(Date.now());
    let today = new Date(`${dateNow.getMonth() + 1},${dateNow.getDate()},${dateNow.getFullYear()}`).getTime();
    let eventDay = new Date(`${getDate.getMonth() + 1},${getDate.getDate()},${getDate.getFullYear()}`).getTime();
    let dayMilliseconds = 1000 * 60 * 60 * 24;

    switch (true) {
      case today === eventDay : return  `today in ${time}`;
      case (today + dayMilliseconds) === eventDay :  return `tomorrow in ${time}`;
      case today < eventDay : return `${getDate.getDate()} ${this.monthNames[getDate.getMonth()]} ${getDate.getFullYear()} in ${time}`;
      case today > (today - dayMilliseconds) : return `is over`;
      default: return `event is end`;
    }
  }
=======

  constructor() { }

  ngOnInit() {}

>>>>>>> origin
}
