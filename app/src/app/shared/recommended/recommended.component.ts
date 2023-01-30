import {Component, Input, OnInit} from '@angular/core';
import {UserInterface} from "../../core/interface/user.interface";
import {NewsInterface} from "../../core/interface/news.interface";

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss'],
})
export class RecommendedComponent implements OnInit {
  @Input('recommended') recommended: NewsInterface[];

  constructor() { }

  ngOnInit() { }
}
