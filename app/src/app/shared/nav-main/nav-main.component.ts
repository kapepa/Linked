import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { PopoverComponent } from "../popover/popover.component";
import { AuthService } from "../../core/service/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss'],
})
export class NavMainComponent implements OnInit, AfterViewInit, OnDestroy {
  userAvatar: string;
  userAvatarSubscription: Subscription;
  @ViewChild('popupAnchor') popup: ElementRef;

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userAvatarSubscription = this.authService.userAvatar.subscribe((avatar: string) => this.userAvatar = avatar);
  }

  ngAfterViewInit() {
    // this.popup['el'].click()
  }

  ngOnDestroy() {
    this.userAvatarSubscription.unsubscribe();
  }

  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      showBackdrop: false,
      componentProps: {closePresentPopover: () => popover.dismiss(),},
      event: e,
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    // this.roleMsg = `Popover dismissed with role: ${role}`;
  }
}
