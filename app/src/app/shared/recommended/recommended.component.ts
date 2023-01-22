import {Component, Input, OnInit} from '@angular/core';
import {UserInterface} from "../../core/interface/user.interface";


@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss'],
})
export class RecommendedComponent implements OnInit {
  @Input('recommended') recommended: UserInterface[];

  constructor() { }

  ngOnInit() { console.log(this.recommended) }

}
