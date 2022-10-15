import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-popup-friends',
  templateUrl: './popup-friends.component.html',
  styleUrls: ['./popup-friends.component.scss'],
})
export class PopupFriendsComponent implements OnInit {
  @Input('closePopupFriends') closePopupFriends: () => void;
  constructor() { }

  ngOnInit() {}

}
