import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SocketService } from "../service/chat.service";
import { switchMap, take } from "rxjs/operators";
import { UserInterface } from "../interface/user.interface";

@Injectable({
  providedIn: 'root'
})
export class ConversationResolver implements Resolve<boolean> {
  constructor(
    private socketService: SocketService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.socketService.receiveAllConversation().pipe(
      take(1),
      switchMap(( friends: UserInterface[] ) => {
        console.log(friends)
        return of(true);
      })
    )
  }
}
