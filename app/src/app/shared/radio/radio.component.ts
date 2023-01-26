import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent implements OnInit {
  @Input('selected') selected: string;
  @Input('list') list: {name: string, val: string}[];
  @Output('onRadioChange') onRadioChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  onRadio(val: string) {
    this.onRadioChange.emit(val);
  }
}
