import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss'],
})
export class CreatePublicationComponent implements OnInit {
  @Input() onClosePublication: () => void
  constructor() { }

  ngOnInit() {}

  onClose(e: Event) {
    this.onClosePublication();
  }

}
