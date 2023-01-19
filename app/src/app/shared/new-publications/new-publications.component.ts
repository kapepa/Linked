import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from "../../core/service/auth.service";
import { PostService } from "../../core/service/post.service";

@Component({
  selector: 'app-new-publications',
  templateUrl: './new-publications.component.html',
  styleUrls: ['./new-publications.component.scss'],
})
export class NewPublicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  userAvatar: string;
  userAvatarSubscription: Subscription;

  @ViewChild('post') post: ElementRef<HTMLInputElement>;
  @ViewChild('photoFile') photoFile: ElementRef<HTMLInputElement>;
  @ViewChild('videoFile') videoFile: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.userAvatarSubscription = this.authService.userAvatar.subscribe((avatar: string) => this.userAvatar = avatar);
  }

  ngAfterViewInit() {
    // this.post['el'].click();
  }

  ngOnDestroy() {
    this.userAvatarSubscription.unsubscribe();
  }

  onPhoto(e: Event) {
    this.photoFile.nativeElement.click();
  }

  changePhoto(e: Event) {
    let file = (e.target as HTMLInputElement).files[0];
    this.postService.installPostField({ img: file });
  }

  onVideo(e: Event) {
    this.videoFile.nativeElement.click();
  }

  changeVideo(e: Event) {
    let file = (e.target as HTMLInputElement).files[0];
    this.postService.installPostField({ video: file });
  }
}
