import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpService } from "./http.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { UserClass } from "../../../utils/user-class";
import { FriendClass } from "../../../utils/friend-class";
import { UserInterface } from "../interface/user.interface";

describe('UserService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: UserService;
  let mockUser = UserClass;
  let mockFriends = FriendClass;

  let mockHttpService = {
    handleError: (err) => {},
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpService, useValue: mockHttpService },
      ],
      imports: [ HttpClientTestingModule ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('get own profile from token', () => {
    let url;

    beforeEach(() => {
      url = `${service.configUrl}/api/users`
    })

    it('success receive own profile', () => {
      service.getOwnProfile().subscribe({
        next: user => expect(service.user).toEqual(user),
        error: fail
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockUser);
    })

    it('should turn 404 into a user error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      service.getOwnProfile().subscribe({
        next: user => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse)
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(errorResponse, {...errorResponse});
    });
  })

  describe('exclude request on friending',() => {
    beforeEach(() => {
      service.user = {...mockUser, suggest: [mockFriends]};
    })

    it('should remove request', () => {
      service.exceptRequest(0).subscribe(() => {
        expect(service.user.suggest.length).toEqual(0);
      })
    });
  })

  describe('user getter', () => {
    beforeEach(() => {
      service.user$.next(mockUser);
    })

    it('should be return user', () => {
      service.getUser.subscribe((user: UserInterface) => {
        expect(user).toEqual(mockUser);
      })
    })
  })

});
