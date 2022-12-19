import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import { Subscription } from "rxjs";
import { AuthService } from "../../core/service/auth.service";

@Component({
  selector: 'app-new-publications',
  templateUrl: './new-publications.component.html',
  styleUrls: ['./new-publications.component.scss'],
})
export class NewPublicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  userAvatar: string;
  userAvatarSubscription: Subscription;
  @ViewChild('post') post: ElementRef;

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userAvatarSubscription = this.authService.userAvatar.subscribe((avatar: string) => this.userAvatar = avatar)
  }

  ngAfterViewInit() {
    this.post['el'].click();
  }

  ngOnDestroy() {
    this.userAvatarSubscription.unsubscribe();
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
