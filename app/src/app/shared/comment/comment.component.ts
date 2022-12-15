import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PostService } from "../../core/service/post.service";
import { PostInterface } from "../../core/interface/post.interface";
import { Subscription } from "rxjs";
import {CommentInterface} from "../../core/interface/comment.interface";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy {
  commentForm: FormGroup;
  postSub: Subscription;

  comments: CommentInterface[];
  commentsSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.postSub = this.postService.getPost.subscribe(( post: PostInterface ) => {
      this.commentForm = this.fb.group({
        id: [post.id, Validators.required],
        comment: ['', Validators.required],
      });
    })
    this.commentsSub = this.postService.getComments.subscribe((comments: CommentInterface[]) => this.comments = comments);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.commentsSub.unsubscribe();
  }

  onSubmit() {
    if(!this.commentForm.valid) return;
    this.postService.createComment( this.getPostID.value, { comment: this.getComment.value } ).subscribe();
  }

  get getComment() {
    return this.commentForm.get('comment');
  }

  get getPostID() {
    return this.commentForm.get('id');
  }

}
