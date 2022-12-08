import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import {PopupFriendsComponent} from "../popup-friends/popup-friends.component";
import {PopoverController} from "@ionic/angular";
import {UserService} from "../../core/service/user.service";
import {UserInterface} from "../../core/interface/user.interface";
import {Subscription} from "rxjs";
import {ChatService} from "../../core/service/chat.service";

export interface TabsCustomEvent extends CustomEvent {
  detail: { tab: string };
  target: HTMLIonTabsElement;
}

@Component({
  selector: 'app-basement',
  templateUrl: './basement.component.html',
  styleUrls: ['./basement.component.scss'],
})

export class BasementComponent implements OnInit, OnDestroy {
  user: UserInterface;
  userSub: Subscription;

  noRead: boolean = false;
  noReadSub: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private chatService: ChatService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser.subscribe((user: UserInterface) => this.user = user);
    this.noReadSub = this.chatService.getNoRead.subscribe((bool) => this.noRead = bool);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.noReadSub.unsubscribe();
  }

  onClickBtn(path: string) {
    this.router.navigate([`/${path}`]);
  }

  async onFriends(e: Event) {
    e.preventDefault();
    const popover = await this.popoverController.create({
      component: PopupFriendsComponent,
      showBackdrop: false,
      componentProps: { closePopupFriends: () => popover.dismiss() },
      side: 'bottom',
    });

    await popover.present();
  }

}
