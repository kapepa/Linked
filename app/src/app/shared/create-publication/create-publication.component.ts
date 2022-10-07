import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {PostService} from "../../core/service/post.service";
import {PostInterface} from "../../core/interface/post.interface";

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss'],
})
export class CreatePublicationComponent implements OnInit {
  @Input() onClosePublication: () => void;
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.postForm = this.fb.group({
      id: [''],
      body: ['', Validators.required],
    });
  }

  onClose(e: Event) {
    this.onClosePublication();
  }

  onSubmit(e: Event) {
    this.postService.createPost({body: this.body.value}).subscribe((post: PostInterface) => {
      this.onClosePublication();
      this.postForm.reset();
    })
  }

  get body (){
    return this.postForm.get('body')
  }

  get edit () {
    return this.postForm.get('id').value
  }
}
