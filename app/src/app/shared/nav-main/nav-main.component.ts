import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { PopoverComponent } from "../popover/popover.component";
import { AuthService } from "../../core/service/auth.service";
import { Subscription } from "rxjs";
import {PopupFriendsComponent} from "../popup-friends/popup-friends.component";
import {UserService} from "../../core/service/user.service";
import {UserInterface} from "../../core/interface/user.interface";

@Component({
  selector: 'app-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss'],
})
export class NavMainComponent implements OnInit, AfterViewInit, OnDestroy {
  user: UserInterface;
  userSub: Subscription;

  userAvatar: string;
  userAvatarSub: Subscription;

  @ViewChild('popupAnchor') popup: ElementRef;
  @ViewChild('popupFriends') friends: ElementRef;

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser.subscribe((user: UserInterface) => this.user = user);
    this.userAvatarSub = this.authService.userAvatar.subscribe((avatar: string) => this.userAvatar = avatar);
  }

  ngAfterViewInit() {
    // this.popup['el'].click()
    // this.friends.nativeElement.click()
  }

  ngOnDestroy() {
    this.userAvatarSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      showBackdrop: false,
      componentProps: {closePresentPopover: () => popover.dismiss() },
      event: e,
    });

    await popover.present();
  }

  async onFriends(e: Event) {
    e.preventDefault();
    const popover = await this.popoverController.create({
      component: PopupFriendsComponent,
      showBackdrop: false,
      componentProps: { closePopupFriends: () => popover.dismiss() },
      event: e,
      side: 'bottom',
    });

    await popover.present();
  }
}
