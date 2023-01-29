import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, throwError} from "rxjs";
import {PopoverController} from "@ionic/angular";
import {PopupNotificationComponent} from "../../shared/popup-notification/popup-notification.component";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  isError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    public popoverController: PopoverController,
  ) {
    this.isError$.subscribe(async (error: string) => {
      if(!!error) await this.presentPopover(error);
    })
  }

  handleErrorFn(error: HttpErrorResponse) {
    if (error?.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      this.isError$.next(error.error?.message ? error.error.message : error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  get handleError () {
    return this.handleErrorFn.bind(this);
  }

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

  toForm(obj: {[key: string]: any}) {
    return Object.keys(obj).reduce((accum: FormData, key: string) => {
      accum.append(key, obj[key]);
      return accum;
    }, new FormData())
  }
}
