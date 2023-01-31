import {Component, Input, OnInit} from '@angular/core';
import {NewsInterface} from "../../core/interface/news.interface";

@Component({
  selector: 'app-main-news',
  templateUrl: './main-news.component.html',
  styleUrls: ['./main-news.component.scss'],
})
export class MainNewsComponent implements OnInit {
  @Input('news') news: NewsInterface;

  constructor() { }

  ngOnInit() {}

  onTrack(e: Event){

  }

  get getDOMContent() {
    return new DOMParser().parseFromString(this.news.content, "text/html").body.innerText;
  };
}
