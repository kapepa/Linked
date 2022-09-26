import { Component, OnInit } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";

@Component({
  selector: 'app-new-publications',
  templateUrl: './new-publications.component.html',
  styleUrls: ['./new-publications.component.scss'],
})
export class NewPublicationsComponent implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  async onPublication(e: Event){
    const popover = await this.popoverController.create({
      component: CreatePublicationComponent,
      event: e,
      size: "cover",
      side: "bottom",
      animated: false,
      dismissOnSelect: false,
      cssClass: 'new-publications__create',
    });

    return await popover.present();
  }
}
