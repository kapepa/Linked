import {Component, Input, OnInit} from '@angular/core';
import {UserInterface} from "../../core/interface/user.interface";

@Component({
  selector: 'app-recommended-cell',
  templateUrl: './recommended-cell.component.html',
  styleUrls: ['./recommended-cell.component.scss'],
})
export class RecommendedCellComponent implements OnInit {
  @Input('user') user: UserInterface;

  constructor() { }

  ngOnInit() {}
}
