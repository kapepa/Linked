import { Component, Input, OnInit } from '@angular/core';
import { PostInterface } from "../../core/interface/post.interface";
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import {Observable} from "rxjs";
import {PostService} from "../../core/service/post.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() index: number;
  @Input() userID: string;
  @Input() post: PostInterface;
  constructor(
    public popoverController: PopoverController,
    private postService: PostService
  ) { }

  ngOnInit() {}

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
    const { role } = await popover.onDidDismiss();
  }

  onDelete(e: Event) {
    this.postService.deletePost(this.index, this.post.id).subscribe(() => {})
  }
}
