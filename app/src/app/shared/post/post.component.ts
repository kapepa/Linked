import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { PostInterface } from "../../core/interface/post.interface";
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import { PostService } from "../../core/service/post.service";
import {Subscription} from "rxjs";

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

  postLoad: boolean;
  postLoadSub: Subscription;

  constructor(
    private postService: PostService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.postLoadSub = this.postService.getPostLoad.subscribe((bool: boolean) => this.postLoad = bool);
  }

  ngOnDestroy() {
    this.postLoadSub.unsubscribe();
  }

  async onEdit(e: Event) {
    const popover = await this.popoverController.create({
      component: CreatePublicationComponent,
      cssClass: 'new-publications__create',
      componentProps: {
        onClosePublication: () => popover.dismiss(),
        index: this.index,
        post: this.post,
      }
    });

    await popover.present();
  }

  onDelete(e: Event) {
    this.postService.deletePost(this.index, this.post.id).subscribe(() => {})
  }

  onAuthor(e: Event) {
    e.stopPropagation();
  }

  onLike(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.postService.likeTapePost(this.post.id, this.index).subscribe();
  }

  get avatar () {
    return this.userID === this.post?.author.id  ? this.userAvatar : this.post.author.avatar
  }
}
