import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { PostInterface } from "../../core/interface/post.interface";
import { PopoverController } from "@ionic/angular";
import { PostService } from "../../core/service/post.service";
import { Subscription } from "rxjs";
import { PopupCommentComponent } from "../popup-comment/popup-comment.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() index: number;
  @Input() userID: string;
  @Input() post: PostInterface;
  @Input() userAvatar: string;
  @Output() editPost = new EventEmitter<{index: number, post: PostInterface}>()

  postLoad: boolean;
  postLoadSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.postLoadSub = this.postService.getPostLoad.subscribe((bool: boolean) => this.postLoad = bool);
  }

  ngOnDestroy() {
    this.postLoadSub.unsubscribe();
  }

  onEdit(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    this.editPost.emit({index: this.index, post: this.post})
  }


  onDelete(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.postService.deletePost(this.index, this.post.id).subscribe(() => {})
  }

  async onAuthor(e: Event) {
    e.stopPropagation();
    if(this.userID !== this.post?.author?.id) await this.router.navigate(['/person', this.post.author.id]);
  }

  onLike(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.postService.likeTapePost(this.post.id, this.index).subscribe();
  }

  onComment(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    let postServiceSub = this.postService.getOnePost(this.post.id).subscribe({
      next: async () => {
        const popover = await this.popoverController.create({
          component: PopupCommentComponent,
          cssClass: 'post__popup-comment',
          componentProps: { closePopup: async () => { await popover.dismiss() } }
        });

        await popover.present();
      },
      complete: () => postServiceSub.unsubscribe(),
    })
  }

  get avatar () {
    return this.userID === this.post?.author.id  ? this.userAvatar : this.post.author.avatar
  }
}
