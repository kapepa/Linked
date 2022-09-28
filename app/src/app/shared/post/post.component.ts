import { Component, Input, OnInit } from '@angular/core';
import { PostInterface } from "../../core/interface/post.interface";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: PostInterface
  @Input() index: number
  constructor() { }

  ngOnInit() {
    // console.log(this.post)
  }

}
