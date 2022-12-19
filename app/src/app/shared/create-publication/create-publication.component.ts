import {Component, EventEmitter, Input, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../../core/service/post.service";
import {PostInterface} from "../../core/interface/post.interface";
import {AuthService} from "../../core/service/auth.service";
import {Subscription} from "rxjs";
import {UserJwtDto} from "../../core/dto/user-jwt.dto";

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss'],
})
export class CreatePublicationComponent implements OnInit, OnDestroy {
  user: UserJwtDto;
  userSub: Subscription;

  @ViewChild('inputImg') inputImg: ElementRef<HTMLInputElement>;

  @Input() onClosePublication: () => void;
  @Input() post?: PostInterface;
  @Input() index?: number;

  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    if ( this.index !== null && !!this.post ){
      this.postForm = this.fb.group({
        id: [this.post.id],
        img: [this.post.img],
        body: [this.post.body, Validators.required],
      });
    } else {
      this.postForm = this.fb.group({
        id: [''],
        img: [null, Validators.required],
        body: ['', Validators.required],
      });
    }

    this.userSub = this.authService.getUser.subscribe((user: UserJwtDto ) => this.user = user);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onClose(e: Event) {
    this.onClosePublication();
  }

  onSubmit(e: Event) {
    if( this?.index !== null && !!this?.post ){
      let img = this.img !== this.post.img? {img: this.img} : {};
      this.postService.updatePost(this.index, this.edit,{
        ...img,
        body: this.body.value,
      }).subscribe((post: PostInterface) => {
        this.onClosePublication();
        this.postForm.reset();
      })
    } else {
      this.postService.createPost({
        img: this.img,
        body: this.body.value,
      }).subscribe((post: PostInterface) => {
        this.onClosePublication();
        this.postForm.reset();
      })
    }
  }

  onImg(e: Event){
    (this.inputImg.nativeElement as HTMLInputElement).click();
  }

  onChangeImg(e: Event) {
    let file = (e.target as HTMLInputElement).files[0];
    this.postForm.patchValue({img: file});
  }

  get body () {
    return this.postForm.get('body');
  }

  get edit () {
    return this.postForm.get('id').value;
  }

  get img () {
    return this.postForm.get('img').value;
  }
}
