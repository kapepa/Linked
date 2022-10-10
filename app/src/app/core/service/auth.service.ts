import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, BehaviorSubject, throwError, of, from} from "rxjs";
import {catchError, switchMap, take, tap} from "rxjs/operators";
import {StorageService} from "./storage.service";
import jwt_decode from "jwt-decode";
import {Role, UserJwtDto} from "../dto/user-jwt.dto";
import {Router} from "@angular/router";
import {HttpService} from "./http.service";

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
  user: UserJwtDto | null = null;
  user$ = new BehaviorSubject<UserJwtDto>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private httpService: HttpService
  ) {}

  registration(form: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/api/auth/registration`,form).pipe(
      take(1),
      catchError(this.httpService.handleError),
    );
  }

  login(body: { password: string; email: string }): Observable<{ access_token: string }> {
    return this.http.post<{access_token: string}>(`${this.baseUrl}/api/auth/login`,body).pipe(
      tap((res: { access_token: string }) => {
        let token = res.access_token
        this.storageService.set('token', token)
        this.user = jwt_decode(token);
        this.user$.next(this.user);
      }),
      take(1),
      catchError(this.httpService.handleError)
    )
  }

  logout(){
    this.user = null;
    this.user$.next(this.user);
    this.router.navigate(['/auth','login']);
    this.storageService.remove('token');
  }

  avatar(form: FormData): Observable<{access_token: string}> {
    return this.http.post<{access_token: string}>(`${this.baseUrl}/api/users/avatar`, form).pipe(
      take(1),
      tap((res: {access_token: string}) => {
        let token = res.access_token
        this.storageService.set('token', token)
        this.user = jwt_decode(token);
        this.user$.next(this.user);
      }),
      catchError(this.httpService.handleError)
    )
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: UserJwtDto) => {
        return of(user.role);
      })
    )
  }

  get isLogin(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      take(1),
      switchMap((user: UserJwtDto) => {
        return of(!!user)
      })
    )
  }

  get tokenExp(): Observable<boolean> {
    return from(this.storageService.get('token')).pipe(
      take(1),
      switchMap((token: string) => {
        if(!token) return of(false);
        const parseToken: UserJwtDto = jwt_decode(token);
        if (!!parseToken) this.user$.next(parseToken);
        return of(parseToken['exp'] * 1000 > Date.now());
      })
    )
  }

  get userID(): Observable<string>{
    return this.user$.asObservable().pipe(
      take(1),
      switchMap((user: UserJwtDto) => {
        return of(user?.id ?? null);
      })
    )
  }

  get userAvatar () {
    return this.user$.asObservable().pipe(
      switchMap((user: UserJwtDto) => {
        return of(user.avatar);
      })
    )
  }
}
