import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatService } from "../service/chat.service";
import { switchMap } from "rxjs/operators";
import { ChatInterface } from "../interface/chat.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatResolver implements Resolve<boolean> {
  constructor(
    private chatService: ChatService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // return this.chatService.requestChat().pipe(
    //   switchMap(( chat: ChatInterface ) => {
    //     return of(!!Object.keys(chat).length);
    //   })
    // )
    return of(true)
  }
}
