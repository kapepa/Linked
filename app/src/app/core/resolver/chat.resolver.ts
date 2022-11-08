import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SocketService } from "../service/chat.service";
import { switchMap } from "rxjs/operators";
import { ChatInterface } from "../interface/chat.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatResolver implements Resolve<boolean> {
  constructor(
    private socketService: SocketService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.socketService.appendToRoom('first');
    return this.socketService.requestChat('first').pipe(
      switchMap(( chat: ChatInterface ) => {
        return of(!!Object.keys(chat).length);
      })
    )
  }
}
