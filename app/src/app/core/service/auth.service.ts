import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject,  of, from } from "rxjs";
import { catchError, switchMap, take, tap } from "rxjs/operators";
import { StorageService } from "./storage.service";
import jwt_decode from "jwt-decode";
import { UserJwtDto } from "../dto/user-jwt.dto";
import { Router } from "@angular/router";
import { HttpService } from "./http.service";
import {Role, UserDto} from "../dto/user.dto";
import { ChatService } from "./chat.service";
import { SocketService } from "./socket.service";

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

  authLoading: boolean = false;
  authLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.authLoading);

  user: UserJwtDto | null = null;
  user$ = new BehaviorSubject<UserJwtDto>(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private httpService: HttpService,
    private chatService: ChatService,
    private socketService: SocketService,
    private storageService: StorageService,
  ) {}

  googleAuth(): Observable<any> {
    this.setAuthLoading = ! this.authLoading;
    return this.http.get<any>(`${this.baseUrl}/api/auth/google`).pipe(
      tap({
        // next: (res) => console.log(res),
        complete: () => this.setAuthLoading = ! this.authLoading,
      }),
      take(1),
      catchError(this.httpService.handleError),
    )
  }

  socialAuth(user: UserDto): Observable<{access_token: string}> {
    this.setAuthLoading = !this.authLoading;
    return this.http.post<{access_token: string}>(`${this.baseUrl}/api/auth/social`, user).pipe(
      tap({
        next: (res: {access_token: string}) => {
          let token = res.access_token;
          this.storageService.set('token', token);
          this.user = this.jwtDecode(token);
          this.user$.next(this.user);
        },
        complete: () => this.setAuthLoading = ! this.authLoading,
      }),
      take(1),
      catchError(this.httpService.handleError),
    )
  }

  registration(form: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/api/auth/registration`,form).pipe(
      take(1),
      catchError(this.httpService.handleError),
    );
  }

  login(body: { password: string; email: string }): Observable<{ access_token: string }> {
    return this.http.post<{access_token: string}>(`${this.baseUrl}/api/auth/login`,body).pipe(
      tap((res: { access_token: string }) => {
        let token = res.access_token;
        this.storageService.set('token', token);
        this.user = this.jwtDecode(token);
        this.user$.next(this.user);
      }),
      take(1),
      catchError(this.httpService.handleError)
    )
  }

  async logout(){
    this.storageService.remove('token');
    await this.socketService.createSocket();
    await this.router.navigate(['/auth','login']);
    this.user = null;
    this.user$.next({} as UserJwtDto);
  }

  avatar(form: FormData): Observable<{access_token: string}> {
    return this.http.post<{access_token: string}>(`${this.baseUrl}/api/users/avatar`, form).pipe(
      take(1),
      tap(async (res: {access_token: string}) => {
        let token = res.access_token
        this.storageService.set('token', token)
        this.user = this.jwtDecode(token);
        this.user$.next(this.user);
        await this.socketService.connect();
      }),
      catchError(this.httpService.handleError)
    )
  }

  jwtDecode(token: string): UserJwtDto {
    return jwt_decode(token)
  }

  set setAuthLoading(bool) {
    this.authLoading = bool;
    this.authLoading$.next(this.authLoading);
  }

  get getAuthLoading() {
    return this.authLoading$.asObservable();
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      take(1),
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
        const parseToken: UserJwtDto = this.jwtDecode(token);
        if (!!parseToken) this.user$.next(parseToken);
        return of(!(Date.now() >= parseToken.exp * 1000));
      })
    )
  }

  get userID(): Observable<string>{
    return this.user$.asObservable().pipe(
      take(1),
      switchMap((user: UserJwtDto) => {
        return of(user?.id ?? null);
      })
    );
  }

  get userAvatar (): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: UserJwtDto) => {
        return of(user?.avatar);
      }),
    );
  }

  get getUser(): Observable<UserJwtDto> {
    return this.user$.asObservable();
  };
}
