import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Editor, Toolbar, Validators} from "ngx-editor";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import jsonDoc from './doc';

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

  form = new FormGroup({
    title: new FormControl<string>({ value: '', disabled: false }, [Validators.required(), Validators.minLength(6)]),
    img: new FormControl<null | File>({ value: null, disabled: true}, Validators.required()),
    editorContent: new FormControl<string>({ value: '', disabled: false }, Validators.required()),
  });

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
    console.log(this.form.valid)
  }

  get doc(): AbstractControl {
    return this.form.get('editorContent');
  }

  get getTitle() {
    return this.form.get('title');
  }

  get getImg() {
    return this.form.get('img');
  }
}
