import {Component, OnInit, Input} from '@angular/core';

type color = 'red' | 'black';

@Component({
  selector: 'app-popup-notification',
  templateUrl: './popup-notification.component.html',
  styleUrls: ['./popup-notification.component.scss'],
})
export class PopupNotificationComponent implements OnInit {
  @Input() error: string;
  @Input() title: string;
  @Input() titleColor: color;
  @Input() closePopupNotification: () => void;

  constructor() { }

  ngOnInit() {}

  onClose(e: Event) {
    let target = e.target as HTMLElement;
    if(target.classList.contains('popup-notification__title') || target.classList.contains('popup-notification__btn')){
      this.closePopupNotification();
    }
  }
}
