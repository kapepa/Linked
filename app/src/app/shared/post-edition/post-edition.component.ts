import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {PostInterface} from "../../core/interface/post.interface";

@Component({
  selector: 'app-post-edition',
  templateUrl: './post-edition.component.html',
  styleUrls: ['./post-edition.component.scss'],
})
export class PostEditionComponent implements OnInit, OnDestroy {
  @Input('post') post: PostInterface;

  constructor() { }

  ngOnInit() {
    console.log(this.post)
  }

  ngOnDestroy() {

  }

}
