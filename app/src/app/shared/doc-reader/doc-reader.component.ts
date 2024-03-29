import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-doc-reader',
  templateUrl: './doc-reader.component.html',
  styleUrls: ['./doc-reader.component.scss'],
})
export class DocReaderComponent implements OnInit {
  @Input('file') file?: File | string;
  @Input('alt') alt?: string;
  @Input('class') class?: string;
  @Input('clearFile') clearFile?: () => void;

  @ViewChild('fileView') fileView?: ElementRef<HTMLDivElement>

  configUrl = environment.configUrl;
  fileText?: string;
  reader = new FileReader();

  constructor() { }

  ngOnInit() {}

  docSrc() {
    if ( typeof this.file !== 'string' && !!this.file?.name ) {
      this.reader.readAsDataURL(this.file);
      this.reader.onload = () => this.fileText = this.reader.result as string;
    } else if (typeof this.file === 'string' ) {
      this.fileText = `${environment.configUrl}/${this.file}`;
    }
  }

  onClose(e: Event) {
    if(!!this.clearFile) this.clearFile();
  }

}
