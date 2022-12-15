import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-popup-comment',
  templateUrl: './popup-comment.component.html',
  styleUrls: ['./popup-comment.component.scss'],
})
export class PopupCommentComponent implements OnInit {
  @Input('closePopup') closePopup: () => void;

  constructor() { }

  ngOnInit() {}

  onClose(e: Event) {
    this.closePopup();
  }

}
