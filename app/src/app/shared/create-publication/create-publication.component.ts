import {Component, EventEmitter, Input, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../../core/service/post.service";
import {PostInterface} from "../../core/interface/post.interface";
import {AuthService} from "../../core/service/auth.service";
import {Subscription} from "rxjs";
import {UserJwtDto} from "../../core/dto/user-jwt.dto";
import {PopoverController} from "@ionic/angular";
import {VideoReaderComponent} from "../video-reader/video-reader.component";
import {DocReaderComponent} from "../doc-reader/doc-reader.component";

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss'],
})
export class CreatePublicationComponent implements OnInit, OnDestroy {
  user: UserJwtDto;
  userSub: Subscription;

  @ViewChild('inputImg') inputImg: ElementRef<HTMLInputElement>;
  @ViewChild('inputFile') inputFile: ElementRef<HTMLInputElement>;
  @ViewChild('inputVideo') inputVideo: ElementRef<HTMLInputElement>;

  @Input() onClosePublication: () => void;
  @Input() post?: PostInterface;
  @Input() index?: number;

  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    if ( this.index !== null && !!this.post ){
      this.postForm = this.fb.group({
        id: [this.post.id],
        img: [this.post.img],
        video: [this.post.video],
        file: [this.post.file],
        body: [this.post.body, Validators.required],
      });
    } else {
      this.postForm = this.fb.group({
        id: [''],
        img: [null, Validators.required],
        video: [null],
        file: [null],
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
      let img = this.img.value !== this.post.img ? {img: this.img.value} : undefined
      let video = this.video.value !== this.post.video ? {img: this.video.value} : undefined;
      let file = this.file.value !== this.post.file ? {file: this.file.value} : undefined;
      this.postService.updatePost(this.index, this.edit, Object.assign({body: this.body.value}, video, img, file))
        .subscribe((post: PostInterface) => {
          this.onClosePublication();
          this.postForm.reset();
        })
    } else {
      this.postService.createPost({
        img: this.img.value,
        ...(!!this.video.value) ? { video: this.video.value } : undefined,
        ...(!!this.file.value) ? { file: this.file.value } : undefined,
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
      (this.inputVideo.nativeElement as HTMLInputElement).click()
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
}
