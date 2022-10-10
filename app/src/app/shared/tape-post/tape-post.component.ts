import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from "../../core/service/post.service";
import { PostQueryDto } from "../../core/dto/post-query.dto";
import {AuthService} from "../../core/service/auth.service";
import {Subscription} from "rxjs";

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
  }

  ngOnDestroy() {
    this.userIDSubscription.unsubscribe();
    this.postLengthSubscription.unsubscribe();
    this.userAvatarSubscription.unsubscribe();
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
