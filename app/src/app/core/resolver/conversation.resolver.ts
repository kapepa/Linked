import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatService } from "../service/chat.service";
import { switchMap, take } from "rxjs/operators";
import { UserInterface } from "../interface/user.interface";

@Injectable({
  providedIn: 'root'
})
export class ConversationResolver implements Resolve<boolean> {
  constructor(
    private chatService: ChatService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.chatService.receiveAllConversation().pipe(
      take(1),
      switchMap(( dto: {friends: UserInterface[]}  ) => {
        return of(true);
      })
    )
  }
}
