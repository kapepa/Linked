<<<<<<< HEAD
import {Component, Input, OnInit} from '@angular/core';
import {UserInterface} from "../../core/interface/user.interface";
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> 2f2490c84c31548508b2502ba84af8ad11d1431e

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss'],
})
export class RecommendedComponent implements OnInit {
<<<<<<< HEAD
  @Input('recommended') recommended: UserInterface[];

  constructor() { }

  ngOnInit() { console.log(this.recommended) }
=======

  constructor() { }

  ngOnInit() {}
>>>>>>> 2f2490c84c31548508b2502ba84af8ad11d1431e

}
