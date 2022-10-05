import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, BehaviorSubject, throwError} from "rxjs";
import {catchError, take, tap} from "rxjs/operators";
import {StorageService} from "./storage.service";
import jwt_decode from "jwt-decode";
import {UserJwtDto} from "../dto/user-jwt.dto";
import {Router} from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.configUrl;
  user$ = new BehaviorSubject<UserJwtDto>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
  ) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  registration(form: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/api/auth/registration`,form).pipe(
      take(1),
      catchError(this.handleError),
    );
  }

  login(body: { password: string; email: string }): Observable<{ access_token: string }> {
    return this.http.post<{access_token: string}>(`${this.baseUrl}/api/auth/login`,body).pipe(
      tap((res: { access_token: string }) => {
        let token = res.access_token
        this.storageService.set('token', token)
        this.user$.next(jwt_decode(token))
      }),
      take(1),
      catchError(this.handleError)
    )
  }

  logout(){
    this.user$.next(null);
    this.router.navigate(['/auth','login']);
    this.storageService.remove('token');
  }
}
