import { Component, OnInit } from '@angular/core';
import { PostService } from "../../core/service/post.service";
import { PostQueryDto } from "../../core/dto/post-query.dto";
import {AuthService} from "../../core/service/auth.service";

@Component({
  selector: 'app-tape-post',
  templateUrl: './tape-post.component.html',
  styleUrls: ['./tape-post.component.scss'],
})
export class TapePostComponent implements OnInit {
  postLength: number;
  userID: string;

  constructor(
    private postService: PostService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.postService.postLength.subscribe((postLength: number) => {
      if (postLength) this.postLength = postLength;
    });

    this.authService.userID.subscribe((userID: string) => this.userID = userID);
  }

  getPost(query: PostQueryDto, cd: () => void){
    this.postService.getPosts(query).subscribe({
      next: () => {},
      complete: () => cd()
    });
  }

  loadData(event) {
    this.getPost({take: 6, skip: this.postLength}, () => event.target.complete());
  }

  get posts() {
    return this.postService.posts$
  }
}
