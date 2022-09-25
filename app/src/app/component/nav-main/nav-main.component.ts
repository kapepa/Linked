import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {PopoverComponent} from "../popover/popover.component";
import {fromEvent} from "rxjs";

@Component({
  selector: 'app-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss'],
})
export class NavMainComponent implements OnInit, AfterViewInit {
  @ViewChild('popupAnchor') popup: ElementRef;

  constructor(
    public popoverController: PopoverController,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.popup['el'].click()
  }

  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      showBackdrop: false,
      event: e,
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    // this.roleMsg = `Popover dismissed with role: ${role}`;
  }
}
