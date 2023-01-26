import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CreatePublicationComponent} from "../../../shared/create-publication/create-publication.component";
import {AdditionSearchComponent} from "../../../shared/addition-search/addition-search.component";
import {PopupEventComponent} from "../../../shared/popup-event/popup-event.component";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.scss'],
})
export class PopupsComponent implements OnInit {
  popoverEvent;
  createPopover;
  additionPopover;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe( async (query: Params) => {
      let { create, addition, event } = query;

      if( !!this.createPopover ) this.createPopover.dismiss();
      if( !!this.additionPopover ) this.additionPopover.dismiss();
      if( !!this.popoverEvent ) this.popoverEvent.dismiss();

      if( query.hasOwnProperty('create') && JSON.parse(create) ) await this.createPublication();
      if( query.hasOwnProperty('addition') && JSON.parse(addition) ) await this.additionPublication();
      if( query.hasOwnProperty('event') && JSON.parse(event) ) await this.openEvent();
    })
  }

  async createPublication () {
    this.createPopover = await this.popoverController.create({
      component: CreatePublicationComponent,
      size: "cover",
      animated: false,
      componentProps: {
        type: 'create',
        onClosePublication: () => this.cleanQuery(),
      },
      cssClass: 'new-publications__create',
    });

    this.createPopover.onDidDismiss().then((arg) => {
      if(arg.role === 'backdrop')  this.router.navigate([],{ queryParams: {} });
    })
    return await this.createPopover.present();
  }

  async additionPublication () {
    this.additionPopover = await this.popoverController.create({
      component: AdditionSearchComponent,
      size: "cover",
      animated: false,
      componentProps: {
        type: 'create',
        onClosePublication: () => this.cleanQuery(),
      },
      cssClass: 'new-publications__create',
    });

    this.additionPopover.onDidDismiss().then((arg) => {
      if(arg.role === 'backdrop')  this.router.navigate([],{ queryParams: {} })
    })
    return await this.additionPopover.present();
  }

  async openEvent() {
    this.popoverEvent = await this.popoverController.create({
      component: PopupEventComponent,
      size: "cover",
      animated: false,
      componentProps: {
        closeEvent: () => this.cleanQuery(),
      },
      cssClass: 'new-publications__create',
    });

    this.popoverEvent.onDidDismiss().then((arg) => {
      if(arg.role === 'backdrop')  this.router.navigate([],{ queryParams: {} })
    })
    await this.popoverEvent.present();
  }

  async cleanQuery() {
    await this.router.navigate([],{ queryParams: {} });
  }
}
