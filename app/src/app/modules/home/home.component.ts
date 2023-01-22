import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserService} from "../../core/service/user.service";
import {UserInterface} from "../../core/interface/user.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

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


}
