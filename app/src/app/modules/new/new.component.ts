import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Editor, Toolbar, Validators} from "ngx-editor";
import {AbstractControl, FormBuilder, FormControl} from "@angular/forms";
import jsonDoc from './doc';
import {NewsService} from "../../core/service/news.service";
import {Router} from "@angular/router";
import {NewsInterface} from "../../core/interface/news.interface";

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
    title: [ '', [Validators.required(), Validators.minLength(6)] ],
    img: [ null, [Validators.required] ],
    content: [ '', [Validators.required] ],
  });

  constructor(
    private router: Router,
    private newsService: NewsService,
    private fb: FormBuilder,
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
    this.newsService.createNews(this.form.value).subscribe((news: NewsInterface) => {
      this.router.navigate(['/news', news.id]);
    })
  }

  get doc(): AbstractControl {
    return this.form.get('content');
  }

  get getTitle(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get getImg(): FormControl {
    return this.form.get('img') as FormControl;
  }
}
