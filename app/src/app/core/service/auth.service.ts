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
import { Role } from "../dto/user.dto";
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
