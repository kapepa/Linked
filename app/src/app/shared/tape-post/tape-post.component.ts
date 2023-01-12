import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from "../../core/service/post.service";
import { PostQueryDto } from "../../core/dto/post-query.dto";
import { AuthService } from "../../core/service/auth.service";
import { Subscription } from "rxjs";
import { PostInterface } from "../../core/interface/post.interface";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import { PopoverController } from "@ionic/angular";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AdditionSearchComponent } from "../addition-search/addition-search.component";

@Component({
  selector: 'app-tape-post',
  templateUrl: './tape-post.component.html',
  styleUrls: ['./tape-post.component.scss'],
})
export class TapePostComponent implements OnInit, OnDestroy {
  editPopover
  additionPopover

  userID: string;
  userIDSubscription: Subscription;

  userAvatar: string;
  userAvatarSubscription: Subscription;

  postLength: number;
  postLengthSubscription: Subscription;

  posts: PostInterface[];
  postsSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.postLengthSubscription = this.postService.postLength.subscribe((postLength: number) => {
      if (postLength) this.postLength = postLength;
    });

    this.userIDSubscription = this.authService.userID.subscribe((userID: string) => this.userID = userID);
    this.userAvatarSubscription = this.authService.userAvatar.subscribe((avatar: string) => this.userAvatar = avatar);
    this.postsSub = this.postService.getPostsAll.subscribe((posts: PostInterface[]) => this.posts = posts);

    this.route.queryParams.subscribe(async (params: Params) => {
      if(params.hasOwnProperty('edit') || params.hasOwnProperty('redact')) {
        let { edit, redact, index } = params;
        let order = Number(index);

        if( !edit && !!redact ){
          if(!!this.editPopover) this.editPopover.dismiss();
          return await this.additionPublication({ index: order, id: this.posts[order].id });
        }

        if(!!this.posts[order] && this.posts[order].author.id === this.userID) {
          if(!!this.additionPopover) this.additionPopover.dismiss();
          await this.popoverEdit({index: order, post: this.posts[order]});
        } else {
          await this.router.navigate([],{queryParams: {}})
        }
      }
    })
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
      complete: () => cd(),
    });
  }

  loadData(event) {
    this.getPost({take: 6, skip: this.postLength}, () => event.target.complete());
  }

  async editPost(data: {index: number, post: PostInterface}) {
    let { index, post } = data;

    this.postService.setEditPost = post;
    this.postService.setEditAddition = post.addition;
    await this.router.navigate([], {queryParams: {edit: post.id, index}});
  }

  async popoverEdit(data: {index: number, post: PostInterface}) {
    const { index, post } = data;
    this.editPopover = await this.popoverController.create({
      component: CreatePublicationComponent,
      cssClass: 'new-publications__create',
      componentProps: {
        type: 'edit',
        index: index,
        post: post,
        onClosePublication: () => this.cleanQuery(),
      }
    });

    this.editPopover.onDidDismiss().then((arg) => {
      if(arg.role === 'backdrop')  this.router.navigate([],{ queryParams: {} });
    })

    await this.editPopover.present();
  }

  async additionPublication (data: {index: number, id: string}) {
    let { index, id } = data;
    this.additionPopover = await this.popoverController.create({
      component: AdditionSearchComponent,
      size: "cover",
      animated: false,
      componentProps: {
        type: 'edit',
        query: id,
        index: index,
        onClosePublication: () => this.cleanQuery(),
      },
      cssClass: 'new-publications__create',
    });

    this.additionPopover.onDidDismiss().then((arg) => {
      if(arg.role === 'backdrop')  this.router.navigate([],{ queryParams: {} });
    })

    return await this.additionPopover.present();
  }

  async cleanQuery() {
    await this.router.navigate([],{ queryParams: {} });
  }
}
