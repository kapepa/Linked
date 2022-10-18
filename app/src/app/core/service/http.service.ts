import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, throwError} from "rxjs";
import {PopoverController} from "@ionic/angular";
import {PopupNotificationComponent} from "../../shared/popup-notification/popup-notification.component";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  error: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    public popoverController: PopoverController,
  ) {
    this.error.subscribe(async (error: string) => {
      if(!error) await this.presentPopover(error);
    })
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      this.error.next(error.error.message);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  async presentPopover(error: string): Promise<void> {
    const popover = await this.popoverController.create({
      component: PopupNotificationComponent,
      cssClass:  'popup-notification__popover',
      componentProps: {
        closePopupNotification: () => popover.dismiss(),
        titleColor: 'red',
        title: 'Error',
        error: 'asdasdasd',
      }
    });

    await popover.present();
  }
}
