import {Component, Input, OnInit} from '@angular/core';
import {NewsInterface} from "../../core/interface/news.interface";
import {UserInterface} from "../../core/interface/user.interface";
import {NewsDto} from "../../core/dto/news.dto";

@Component({
  selector: 'app-aside-news',
  templateUrl: './aside-news.component.html',
  styleUrls: ['./aside-news.component.scss'],
})
export class AsideNewsComponent implements OnInit {
  @Input('user') user: UserInterface;
  @Input('tidings') tidings: NewsInterface[] | NewsDto[];

  constructor() { }

  ngOnInit() {}

  getDOMContent(html) {
    return new DOMParser().parseFromString(html, "text/html").body.innerText;
  };
}
