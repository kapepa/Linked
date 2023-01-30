import {Component, Input, OnInit} from '@angular/core';
import {NewsInterface} from "../../core/interface/news.interface";

@Component({
  selector: 'app-recommended-cell',
  templateUrl: './recommended-cell.component.html',
  styleUrls: ['./recommended-cell.component.scss'],
})
export class RecommendedCellComponent implements OnInit {
  @Input('news') news: NewsInterface;

  constructor() { }

  ngOnInit() {}
}
