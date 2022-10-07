import { Component, OnInit } from '@angular/core';
import { PostInterface } from "../../core/interface/post.interface";
import { PostService } from "../../core/service/post.service";
import { PostQueryDto } from "../../core/dto/post-query.dto";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-tape-post',
  templateUrl: './tape-post.component.html',
  styleUrls: ['./tape-post.component.scss'],
})
export class TapePostComponent implements OnInit {
  postLength: number

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.postService.postLength.subscribe((postLength: number) => {
      if (postLength) this.postLength = postLength;
    })
  }

  getPost(query: PostQueryDto, cd: () => void){
    this.postService.getPosts(query).subscribe({
      next: () => {},
      complete: () => cd()
    });
  }

  loadData(event) {
    this.getPost({take: 5, skip: this.postLength}, () => event.target.complete());
  }

  get posts() {
    return this.postService.posts$
  }

}
