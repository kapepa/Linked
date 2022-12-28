import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from "../../core/service/post.service";
import { PostQueryDto } from "../../core/dto/post-query.dto";
import { AuthService } from "../../core/service/auth.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {PostInterface} from "../../core/interface/post.interface";

@Component({
  selector: 'app-tape-post',
  templateUrl: './tape-post.component.html',
  styleUrls: ['./tape-post.component.scss'],
})
export class TapePostComponent implements OnInit, OnDestroy {
  userID: string;
  userIDSubscription: Subscription;

  userAvatar: string;
  userAvatarSubscription: Subscription;

  postLength: number;
  postLengthSubscription: Subscription;

  posts: PostInterface[];
  postsSub: Subscription;

  constructor(
    private postService: PostService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.postLengthSubscription = this.postService.postLength.subscribe((postLength: number) => {
      if (postLength) this.postLength = postLength;
    });

    this.userIDSubscription = this.authService.userID.subscribe((userID: string) => this.userID = userID);
    this.userAvatarSubscription = this.authService.userAvatar.subscribe((avatar: string) => this.userAvatar = avatar);
    this.postsSub = this.postService.getPostsAll.subscribe((posts: PostInterface[]) => this.posts = posts);
  }

  ngOnDestroy() {
    this.userIDSubscription.unsubscribe();
    this.postLengthSubscription.unsubscribe();
    this.userAvatarSubscription.unsubscribe();
    this.postsSub.unsubscribe();
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

  editPost(data: {index: number, post: PostInterface}) {
    console.log(data)
  }
}
