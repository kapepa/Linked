import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {StorageService} from "../service/storage.service";
import {switchMap} from "rxjs/operators";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private storageService: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storageService.get('token')).pipe(
      switchMap(( toke: string ) => {
        if(!toke) return next.handle(req);

        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${toke}`)
        });

        return  next.handle(authReq)
      })
    )
  }
}
