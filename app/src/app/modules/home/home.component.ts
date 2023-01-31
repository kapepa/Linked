import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from "rxjs";
import {NewsInterface} from "../../core/interface/news.interface";
import {NewsService} from "../../core/service/news.service";
import {UserInterface} from "../../core/interface/user.interface";
import {UserService} from "../../core/service/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  user: UserInterface;
  userSub: Subscription;

  tidings: NewsInterface[];
  tidingsSub: Subscription;

  constructor(
    private newsService: NewsService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser.subscribe((user: UserInterface) => this.user = user);
    this.tidingsSub = this.newsService.getTidings.subscribe((tidings: NewsInterface[]) => this.tidings = tidings);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.tidingsSub.unsubscribe();
  }
}
