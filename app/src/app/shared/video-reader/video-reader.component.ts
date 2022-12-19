import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-video-reader',
  templateUrl: './video-reader.component.html',
  styleUrls: ['./video-reader.component.scss'],
})
export class VideoReaderComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('audio') audio: File;
  @Input('alt') alt: string;
  @Input('class') class: string;
  @Input('clearAudio') clearAudio: () => void;

  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLAudioElement>

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.audioSrc()
  }

  ngAfterViewInit() {
    this.audioSrc()
  }

  audioSrc() {
    let audio = this.videoPlayer.nativeElement;
    audio.src = !!this.audio.name ? URL.createObjectURL(this.audio) : `${environment.configUrl}/${this.audio}`;
  }

  onClose(e: Event) {
    this.clearAudio();
  }
}
