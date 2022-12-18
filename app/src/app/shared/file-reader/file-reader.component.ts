import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss'],
})
export class FileReaderComponent implements OnInit {
  @Input('img') img: File;
  @Input('alt') alt: string;
  @Input('class') class: string;

  imgText: BehaviorSubject<string> = new BehaviorSubject<string>('');
  reader = new FileReader();

  constructor() { }

  ngOnInit() {
    if (!!this.img.name) {
      this.reader.readAsDataURL(this.img);
      this.reader.onload = () => this.imgText.next(this.reader.result as string);
    } else if (typeof this.img === 'string' ) {
      this.imgText.next(`${environment.configUrl}/${this.img}`);
    }
  }


}
