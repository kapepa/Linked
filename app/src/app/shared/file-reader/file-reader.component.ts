import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss'],
})
export class FileReaderComponent implements OnInit, OnChanges {
  @Input('img') img: File;
  @Input('alt') alt: string;
  @Input('class') class: string;

  imgText: string;
  reader = new FileReader();

  constructor() { }

  ngOnInit() {
    this.imgSrc();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.imgSrc();
  }

  imgSrc() {
    if (!!this.img.name) {
      this.reader.readAsDataURL(this.img);
      this.reader.onload = () => this.imgText = this.reader.result as string;
    } else if (typeof this.img === 'string' ) {
      this.imgText = `${environment.configUrl}/${this.img}`;
    }
  }

}
