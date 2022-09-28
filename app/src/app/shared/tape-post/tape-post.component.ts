import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { PostInterface } from "../../core/interface/post.interface";
import { PostService } from "../../core/service/post.service";
import { PostQueryDto } from "../../core/dto/post-query.dto";
import { BehaviorSubject } from "rxjs";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {IonInfiniteScroll} from "@ionic/angular";

@Component({
  selector: 'app-tape-post',
  templateUrl: './tape-post.component.html',
  styleUrls: ['./tape-post.component.scss'],
})
export class TapePostComponent implements OnInit {
  posts: PostInterface[] = [];
  postStop: boolean = false;
  posts$ = new BehaviorSubject<PostInterface[]>([] as PostInterface[]);

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.getPost({take: 5, skip: 0});
  }

  getPost(query: PostQueryDto){
    if(this.postStop) return
    this.postService.getPosts(query).subscribe({
      next: (posts: PostInterface[]) => {
        if(posts.length){
          if(posts.slice(-1)[0].id === this.posts.slice(-1)[0]?.id) this.postStop = true;
          for (let post of posts){
            this.posts.push(post);
          }
          // this.posts.push(...posts);
          this.posts$.next(this.posts)
        }
      }
    })
  }

  loadData(event) {
    this.getPost({take: 5, skip: this.posts.length})
  }

}
