import {Component, Input, OnInit} from '@angular/core';
import {NewsInterface} from "../../core/interface/news.interface";
import {UserInterface} from "../../core/interface/user.interface";

@Component({
  selector: 'app-recommended-cell',
  templateUrl: './recommended-cell.component.html',
  styleUrls: ['./recommended-cell.component.scss'],
})
export class RecommendedCellComponent implements OnInit {
  @Input('user') user: UserInterface;
  @Input('news') news: NewsInterface;

  constructor() { }

  ngOnInit() {}
}
