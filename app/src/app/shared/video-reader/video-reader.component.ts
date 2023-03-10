import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-video-reader',
  templateUrl: './video-reader.component.html',
  styleUrls: ['./video-reader.component.scss'],
})
export class VideoReaderComponent implements OnInit, OnChanges, AfterViewInit {
  configUrl = environment.configUrl;

  @Input('audio') audio?: File | string;
  @Input('alt') alt?: string;
  @Input('class') class?: string;
  @Input('clearAudio') clearAudio?: () => void;

  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLAudioElement>

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
    if (!this.videoPlayer) return;
    let audio = this.videoPlayer.nativeElement;
    audio.src = typeof this.audio === "object" ? URL.createObjectURL(this.audio) : `${this.configUrl}/${this.audio}`;
  }

  onClose(e: Event) {
    if(this.clearAudio) this.clearAudio();
  }
}
