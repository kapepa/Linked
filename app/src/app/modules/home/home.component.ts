<<<<<<< HEAD
import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserService} from "../../core/service/user.service";
import {UserInterface} from "../../core/interface/user.interface";
import {Subscription} from "rxjs";
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> origin

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
<<<<<<< HEAD

export class HomeComponent implements OnInit, OnDestroy {
  recommended: UserInterface[];
  recommendedSub: Subscription;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.recommendedSub = this.userService.getRecommended.subscribe((recommended: UserInterface[]) => this.recommended = recommended);
  }

  ngOnDestroy() {
    this.recommendedSub.unsubscribe();
  }

=======
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
>>>>>>> origin

}
