import { Component, OnInit, OnDestroy } from '@angular/core';
import {PostService} from "../../core/service/post.service";
import {PostInterface} from "../../core/interface/post.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-feet',
  templateUrl: './feet.component.html',
  styleUrls: ['./feet.component.scss'],
})
export class FeetComponent implements OnInit, OnDestroy {
  post: PostInterface;
  postSub: Subscription;

  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
    this.postSub = this.postService.getPost.subscribe((post: PostInterface) => this.post = post);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}
