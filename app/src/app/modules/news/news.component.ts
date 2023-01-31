import {Component, OnInit, OnDestroy} from '@angular/core';
import {NewsService} from "../../core/service/news.service";
import {NewsInterface} from "../../core/interface/news.interface";
import {Subscription} from "rxjs";
import {UserInterface} from "../../core/interface/user.interface";
import {UserService} from "../../core/service/user.service";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  user: UserInterface;
  userSub: Subscription;

  news: NewsInterface;
  newsSub: Subscription;

  tidings: NewsInterface[];
  tidingsSub: Subscription;

  constructor(
    private newsService: NewsService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser.subscribe((user: UserInterface) => this.user = user);
    this.newsSub = this.newsService.getNews.subscribe((news: NewsInterface) => this.news = news);
    this.tidingsSub = this.newsService.getTidings.subscribe((news: NewsInterface[]) => this.tidings = news);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
    this.tidingsSub.unsubscribe();
  }

  get getTidings () {
    return this.tidings.filter((news: NewsInterface) => news.id !== this.news.id)
  }
}
