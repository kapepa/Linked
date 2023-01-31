import {Component, Input, OnInit} from '@angular/core';
import {PostInterface} from "../../core/interface/post.interface";

@Component({
  selector: 'app-popup-post',
  templateUrl: './popup-post.component.html',
  styleUrls: ['./popup-post.component.scss'],
})
export class PopupPostComponent implements OnInit {
  @Input('post') post: PostInterface;
  @Input('closePost') closePost: () => {};

  constructor() { }

  ngOnInit() {
    console.log(this.post)
  }

  onClose(e: Event) {
    this.closePost();
  }
}
