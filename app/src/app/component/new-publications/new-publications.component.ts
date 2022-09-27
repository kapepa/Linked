import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-new-publications',
  templateUrl: './new-publications.component.html',
  styleUrls: ['./new-publications.component.scss'],
})
export class NewPublicationsComponent implements OnInit, AfterViewInit {
  @ViewChild('post') post: ElementRef;

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.post['el'].click()
  }

  closePublication(){
    console.log('close')
  }

  async onPublication(e: Event){
    const popover = await this.popoverController.create({
      component: CreatePublicationComponent,
      size: "cover",
      animated: false,
      componentProps: { onClosePublication: () => popover.dismiss(), },
      cssClass: 'new-publications__create',
    });

    return await popover.present();
  }

}
