import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatService } from "../service/chat.service";
import {switchMap, take, tap} from "rxjs/operators";
import { UserInterface } from "../interface/user.interface";
import {PopupNotificationComponent} from "../../shared/popup-notification/popup-notification.component";
import {PopoverController} from "@ionic/angular";
import {FriendsInterface} from "../interface/friends.interface";

@Injectable({
  providedIn: 'root'
})
export class ConversationResolver implements Resolve<boolean> {
  constructor(
    private chatService: ChatService,
    private popoverController: PopoverController,
  ) {}

  async presentPopover(error: string): Promise<void> {
    const popover = await this.popoverController.create({
      component: PopupNotificationComponent,
      cssClass:  'popup-notification__popover',
      componentProps: {
        closePopupNotification: () => popover.dismiss(),
        titleColor: 'red',
        title: 'Error',
        error,
      }
    });

    await popover.present();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.chatService.receiveAllConversation().pipe(
      take(1),
      switchMap( (dto: {friends: UserInterface[]}) => {
        if(!dto.friends.length){
          return of(false).pipe(tap(() => this.presentPopover('You need add new friend!')))
        }
        return of(true);
      })
    )
  }
}
