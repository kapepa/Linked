import {Component, Input, OnInit} from '@angular/core';
import {PostInterface} from "../../core/interface/post.interface";

@Component({
  selector: 'app-aside-post',
  templateUrl: './aside-post.component.html',
  styleUrls: ['./aside-post.component.scss'],
})
export class AsidePostComponent implements OnInit {
  @Input('posts') posts: PostInterface[];

  constructor() { }

  ngOnInit() { }

}
