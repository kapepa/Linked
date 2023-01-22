import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { StorageService } from "./storage.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpService } from "./http.service";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {UserClass} from "../../../utils/user-class";
import jwt_decode from "jwt-decode";
import {Router} from "@angular/router";
import {Role} from "../dto/user.dto";
import {idCard} from "ionicons/icons";
import {UserJwtDto} from "../dto/user-jwt.dto";
import {of} from "rxjs";

describe('AuthService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: AuthService;
  let mockUser = UserClass;
  let router: Router;

  let mockStorageService = {
    set: ( key, token ) => {},
    get: ( key ) => {},
    remove: ( token ) => {},
  };


  let mockHttpService = {
    handleError: (error: HttpErrorResponse) => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        HttpService,
        { provide: StorageService, useValue: mockStorageService },
        { provide: HttpService, useValue: mockHttpService },
      ],
      imports: [
        HttpClientTestingModule,
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  describe('create new user, registration()', () => {
    let url;

    beforeEach(() => {
      url = `${authService.baseUrl}/api/auth/registration`;
    })

    it('success create user', () => {
      authService.registration({} as FormData).subscribe({
        next: bol => {
          expect(bol).withContext('should return success registration').toBeTruthy();
        },
        error: fail
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush(true);
    })

    it('should turn network error into user-facing error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      authService.registration({} as FormData).subscribe({
        next: body => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse),
      });

      const req = httpTestingController.expectOne(url);
      req.flush(errorResponse, {...errorResponse});
    });
  })

  describe('login user login()', () => {
    let url;
    let body = { password: 'myPassword', email: 'myEmail@mail.com' };
    let mockToken = {access_token: 'JWT_token'};

    beforeEach(() => {
      url = `${authService.baseUrl}/api/auth/login`;
    })

    it('success login user', () => {
      spyOn(authService, 'jwtDecode').and.callFake(() => mockUser);

      authService.login(body).subscribe({
        next: (token: { access_token: string }) => {
          expect(token).toEqual(mockToken)
          expect(authService.jwtDecode).toHaveBeenCalledOnceWith(mockToken.access_token);
          expect(authService.user).toEqual(mockUser);
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush(mockToken);
    })

    it('should turn 404 into a user-friendly error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });

      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);
      authService.login(body).subscribe({
        next: login => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse),
      });

      const req = httpTestingController.expectOne(url);
      req.flush(errorResponse.error, {status: 404, statusText: 'Not Found'});
    });
  })

  it('logout user', () => {
    spyOn(mockStorageService, 'remove').and.callFake(() => {});
    let navigate = spyOn(router, 'navigate');

    authService.user = UserClass;
    authService.logout();
    expect(authService.user).toEqual(null);
    expect(navigate).toHaveBeenCalledWith(['/auth','login']);
  })

  describe('load avatar, avatar()', () => {
    let url;
    let mockToken = {access_token: 'JWT_token'};
    let formData = {} as FormData;

    beforeEach(() => {
      url = `${authService.baseUrl}/api/users/avatar`;
    })

    it('success load new avatar', () => {
      spyOn(authService, 'jwtDecode').and.callFake(() => mockUser);
      spyOn(mockStorageService, 'set').and.callFake((key, token) => {})

      authService.avatar(formData).subscribe({
        next: token => {
          expect(token).toEqual(mockToken);
          expect(authService.jwtDecode).toHaveBeenCalledOnceWith(mockToken.access_token);
          expect(mockStorageService.set).toHaveBeenCalledOnceWith('token', mockToken.access_token);
          expect(authService.user).toEqual(mockUser);
        },
        error: fail
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush(mockToken);
    })

    it('should turn 404 into a user-friendly error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      authService.avatar(formData).subscribe({
        next: token => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse),
      });

      const req = httpTestingController.expectOne(url);
      req.flush(errorResponse);
    });
  })

  describe('getters auth', () => {
    beforeEach(() => {
      authService.user$.next(mockUser);
    })

    it('get user role', () => {
      authService.userRole.subscribe((role: Role) => expect(role).toEqual('user'));
    })

    it('is login user boolean', () => {
      authService.isLogin.subscribe((bol: boolean) => expect(bol).toBeTruthy());
    })

    it('token expires return boolean', () => {
      spyOn(mockStorageService, 'get').and.callFake(() => of('access_token'));
      spyOn(authService, 'jwtDecode').and.callFake(() => ({...mockUser, exp: Date.now() + 1000 * 60}))

      authService.tokenExp.subscribe((bol: boolean) => expect(bol).toBeTruthy());
    })

    it('get user id', () => {
      authService.userID.subscribe((userID: string) => expect(userID).toEqual(mockUser.id));
    })

    it('get user avatar', () => {
      authService.userAvatar.subscribe((avatar: string) => expect(avatar).toEqual(mockUser.avatar));
    })

    it('get user', () => {
      authService.getUser.subscribe((user: UserJwtDto) => expect(user).toEqual(mockUser));
    })
  })
});
