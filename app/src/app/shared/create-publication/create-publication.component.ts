import {Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../../core/service/post.service";
import {PostInterface} from "../../core/interface/post.interface";
import {AuthService} from "../../core/service/auth.service";
import {Subscription} from "rxjs";
import {UserJwtDto} from "../../core/dto/user-jwt.dto";
import {PopoverController} from "@ionic/angular";
import {VideoReaderComponent} from "../video-reader/video-reader.component";
import {DocReaderComponent} from "../doc-reader/doc-reader.component";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PostDto} from "../../core/dto/post.dto";
import {AdditionDto} from "../../core/dto/addition.dto";
import {PopupEventComponent} from "../popup-event/popup-event.component";

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss'],
})
export class CreatePublicationComponent implements OnInit, OnDestroy, AfterViewInit {
  select = {
    anyone: { name: 'Anyone', value: 'anyone'},
    contact: { name: 'Contact', value: 'contact'},
    outside: { name: 'Outside', value: 'outside'},
  };

  user: UserJwtDto;
  userSub: Subscription;

  createdPost: PostDto;
  createdPostSub: Subscription;

  editPost: PostDto;
  editPostSub: Subscription;

  createAddition: AdditionDto;
  createAdditionSub: Subscription;

  @ViewChild('inputImg') inputImg: ElementRef<HTMLInputElement>;
  @ViewChild('inputFile') inputFile: ElementRef<HTMLInputElement>;
  @ViewChild('inputVideo') inputVideo: ElementRef<HTMLInputElement>;
  @ViewChild('selectOptions') selectOptions: ElementRef<HTMLIonSelectElement>

  @Input() onClosePublication: () => void;
  @Input() post?: PostInterface;
  @Input() index?: number;
  @Input() type?: string;

  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    if ( this.index !== null && !!this.post ){
      this.editPostSub = this.postService.getEditPost.subscribe((post: PostDto) => {
        if(this.post.id === post?.id) this.initForm(post);
        if(!post || this.post.id !== post?.id) this.initForm(this.post);
      })
      // this.postService.setCreateAddition = this.post.addition;
    } else {
      this.createdPostSub = this.postService.getCreatedPost.subscribe((post: PostDto) => {
        this.initForm(post);
      })
    }

    this.userSub = this.authService.getUser.subscribe(( user: UserJwtDto ) => this.user = user);
  }

  async ngOnDestroy() {
    this.userSub.unsubscribe();
    if ( this.type === 'create' ) this.postService.setCreatedPost = this.saveChangePost();
    if ( this.type === 'edit' ) this.postService.setEditPost = this.saveChangePost();

    this.onClosePublication();
  }

  ngAfterViewInit() {}

  saveChangePost() {
    return {
      ...(!!this.getID.value) ? {id: this.getID.value} : undefined,
      ...(!!this.img.value) ? {img: this.img.value} : undefined,
      ...(!!this.body.value) ? {body: this.body.value} : undefined,
      ...(!!this.video.value) ? {video: this.video.value} : undefined,
      ...(!!this.file.value) ? {file: this.file.value} : undefined,
      ...(!!this.getAccess.value) ? {access: this.getAccess.value} : undefined,
    } as PostDto;
  }

  initForm(post: PostDto | PostInterface) {
    this.postForm = this.fb.group({
      id: [ !!post?.id ? post.id : ''],
      img: [ !!post?.img ? post?.img : null , Validators.required ],
      video: [ !!post?.video ? post.video : null ],
      file: [ !!post?.file ? post.file : null ],
      body: [ !!post?.body ? post.body : '' , Validators.required],
      access: [ !!post?.access ? post.access : this.select.anyone.value ],
    });
  }

  handleChange(e: Event) {
    let target = (e.target as HTMLIonSelectElement).value;
    this.getAccess.patchValue(target);

  }

  compareWith(o1, o2) {
    if (!o1 || !o2) return o1 === o2;
    if (Array.isArray(o2)) return o2.some((o) => o === o1);
    return o1 === o2;
  }

  onClose(e: Event) {
    this.onClosePublication();
  }

  onSubmit(e: Event) {
    if( this?.index !== null && !!this?.post ){
      this.postService.updatePost(this.index, this.edit, {
        ...(!!this.img.value && this.post?.img !== this.img.value) ? { img: this.img.value } : undefined,
        ...(!!this.file.value && this.post?.file !== this.file.value) ? { file: this.file.value } : undefined,
        ...(!!this.body.value && this.post?.body !== this.body.value) ? { body: this.body.value } : undefined,
        ...(!!this.video.value && this.post?.video !== this.video.value) ? { video: this.video.value } : undefined,
        ...(!!this.getAccess.value && this.post?.access !== this.getAccess.value) ? { access: this.getAccess.value } : undefined,
      })
        .subscribe((post: PostInterface) => {
          this.onClosePublication();
          this.postForm.reset();
        })
    } else {
      this.postService.createPost({
        img: this.img.value,
        ...(!!this.video.value) ? { video: this.video.value } : undefined,
        ...(!!this.file.value) ? { file: this.file.value } : undefined,
        access: this.getAccess.value,
        body: this.body.value,
      }).subscribe((post: PostInterface) => {
        this.onClosePublication();
        this.postForm.reset();
      })
    }
  }

  onImg(e: Event) {
    (this.inputImg.nativeElement as HTMLInputElement).click();
  }

  onChangeImg(e: Event) {
    let file = (e.target as HTMLInputElement).files[0];
    this.postForm.patchValue({img: file});
  }

  async onVideo(e: Event) {
    if(!!this.video.value){
      await this.openVideo();
    } else {
      (this.inputVideo.nativeElement as HTMLInputElement).click();
    }
  }

  async onChangeVideo(e: Event) {
    let video = (e.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ video: video });
    await this.openVideo();
  }

  async openVideo() {
    const popover = await this.popoverController.create({
      component: VideoReaderComponent,
      componentProps: {
        audio: this.video.value,
        alt: 'video',
        clearAudio: () => {
          this.video.setValue(null);
          this.inputVideo.nativeElement.value = null;
          this.popoverController.dismiss();
        }
      }
    });

    await popover.present();
  }



  async onFile(e: Event) {
    this.inputFile.nativeElement.click();
  }

  async onChangeFile(e: Event) {
    let file = (e.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ file });
    await this.onChangeDoc();
  }

  async onChangeDoc(){
    const popover = await this.popoverController.create({
      component: DocReaderComponent,
      componentProps: {
        doc: this.file.value,
        alt: 'file',
        clearFile: () => {
          this.file.setValue(null);
          this.inputFile.nativeElement.value = null;
          this.popoverController.dismiss();
        }
      }
    });

    await popover.present();
  }

  get body () {
    return this.postForm.get('body');
  }

  get edit () {
    return this.postForm.get('id').value;
  }

  get img () {
    return this.postForm.get('img');
  }

  get video () {
    return this.postForm.get('video');
  }

  get file() {
    return this.postForm.get('file')
  }

  get getSelectKey() {
    return Object.keys(this.select);
  }

  get getAccess() {
    return this.postForm.get('access');
  }

  get getID() {
    return this.postForm.get('id');
  }
}
