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
  stopPost: boolean = false;
  posts: PostInterface[] = [];
  posts$ = new BehaviorSubject<PostInterface[]>([] as PostInterface[]);

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.getPost({take: 5, skip: 0}, () => {});
  }

  getPost(query: PostQueryDto, cd: () => void){
    if(this.stopPost) return cd();
    this.postService.getPosts(query).subscribe({
      next: (posts: PostInterface[]) => {
        if(posts.length === 0) this.stopPost = ! this.stopPost;
        if(posts.length){
          this.posts.push(...posts);
          this.posts$.next(this.posts);
        }
      },
      complete: () => cd()
    });
  }

  loadData(event) {
    this.getPost({take: 5, skip: this.posts.length}, () => event.target.complete());
  }

}
