import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from "rxjs";
import {NewsInterface} from "../../core/interface/news.interface";
import {NewsService} from "../../core/service/news.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  news: NewsInterface[];
  newsSub: Subscription;

  constructor(
    private newsService: NewsService,
  ) { }

  ngOnInit() {
    this.newsSub = this.newsService.getNews.subscribe((news: NewsInterface[]) => this.news = news);
  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }
}
