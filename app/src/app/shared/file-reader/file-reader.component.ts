import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {environment} from "../../../environments/environment";
import {from, Observable, ObservedValueOf, of} from "rxjs";
import {images} from "ionicons/icons";

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss'],
})
export class FileReaderComponent implements OnInit, OnChanges {
  @Input('img') img: File | File[];
  @Input('alt') alt: string;
  @Input('class') class: string;
  @Input('order') order: 'row' | 'column';

  imgText: string;
  reader = new FileReader();

  imgList: string[] = [];

  constructor() { }

  ngOnInit() {
    // this.imgSrc();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.imgSrc();
  }

  imgSrc() {
    if(Array.isArray(this.img)){
      from(Promise.all(this.img.map(img => this.readDataURL(img)))).subscribe((images: ObservedValueOf<Promise<Awaited<string[]>>> ) => {
        this.imgList = images;
      })
    } else {
      if (!!this.img?.name) {
        from(this.readDataURL(this.img)).subscribe((img: ObservedValueOf<Promise<Awaited<string>>>) => this.imgText = img)
      } else if (typeof this.img === 'string' ) {
        this.imgText = `${environment.configUrl}/${this.img}`;
      }
    }
  }

  readDataURL(img): Promise<string> {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => resolve(reader.result as string);
    })
  }
}
