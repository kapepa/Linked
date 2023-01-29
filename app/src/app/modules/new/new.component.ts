import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Editor, Toolbar, Validators} from "ngx-editor";
import {AbstractControl, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import jsonDoc from './doc';
import {NewsService} from "../../core/service/news.service";

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef;

  editordoc = jsonDoc;

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    // ['link', 'image'],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = this.fb.group({
    title: [ 'Event Title', [Validators.required(), Validators.minLength(6)] ],
    img: [ null, [Validators.required] ],
    content: [ 'Event Title', [Validators.required] ],
  });

  constructor(
    private newsService: NewsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  onClickImg(e: Event) {
    this.fileInput.nativeElement.click();
  }

  onCleaningImg(e: Event) {
    this.getImg.setValue(null);
  }

  onChangeFile(e: Event){
    let file = (e.target as HTMLInputElement).files[0];
    this.getImg.setValue(file);
  }

  onSubmit() {
    this.newsService.createNews(this.form.value).subscribe()
  }

  get doc(): AbstractControl {
    return this.form.get('content');
  }

  get getTitle() {
    return this.form.get('title');
  }
 
  get getImg(): FormControl {
    return this.form.get('img') as FormControl;
  }
}
