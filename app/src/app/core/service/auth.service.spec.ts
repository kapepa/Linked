import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { StorageService } from "./storage.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpService } from "./http.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

describe('AuthService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: AuthService;


  let mockStorageService = {};

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
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  describe('create new user, registration()', () => {
    it('success create user', (done: DoneFn) => {
      authService.registration({} as FormData).subscribe({
        next: bol => {
          expect(bol).withContext('should return success registration').toBeTruthy();
          done();
        },
        error: fail
      });

      const req = httpTestingController.expectOne(`${authService.baseUrl}/api/auth/registration`);
      expect(req.request.method).toEqual('POST');
      req.flush(true);
    })

    it('should turn network error into user-facing error', done => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });

      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse)
      const msg = 'Deliberate 404';
      authService.registration({} as FormData).subscribe({
        next: bol => fail('expected to fail'),
        error: error => {
          expect(error.status).toEqual(404);
          done()
        }
      });

      const req = httpTestingController.expectOne(`${authService.baseUrl}/api/auth/registration`);
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });
  })
});
