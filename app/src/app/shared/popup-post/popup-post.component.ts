import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {PostInterface} from "../../core/interface/post.interface";

@Component({
  selector: 'app-popup-post',
  templateUrl: './popup-post.component.html',
  styleUrls: ['./popup-post.component.scss'],
})
export class PopupPostComponent implements OnInit, OnDestroy{
  @Input('post') post: PostInterface;
  @Input('closePost') closePost: () => {};

  constructor() { }

  ngOnInit() {
    // console.log(this.post)
  }

  ngOnDestroy() {

  }

  onClose(e: Event) {
    this.closePost();
  }

  get getAuthorAvatar() {
    return this.post.author.avatar
  }


}
