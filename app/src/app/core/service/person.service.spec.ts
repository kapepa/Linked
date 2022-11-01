import { TestBed } from '@angular/core/testing';

import { PersonService } from './person.service';
import { HttpService } from "./http.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {UserClass} from "../../../utils/user-class";
import {FriendClass} from "../../../utils/friend-class";
import {UserInterface} from "../interface/user.interface";

describe('PersonService', () => {
  let service: PersonService;
  let httpTestingController: HttpTestingController;
  let mockPerson = {...UserClass, id: 'personID'};
  let mockFiend = FriendClass;

  let mockHttpService = {
    handleError: (err) => {},
  }

  const mockDeleteResult = {
    raw: [],
    affected: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PersonService,
        { provide: HttpService, useValue: mockHttpService },
      ],
      imports: [
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(PersonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get person on id, getPerson()', () => {
    let url;
    beforeEach(() => {
      url = `${service.httpUrl}/api/users/person/`;
    })

    it('success receive person on id', () => {
      service.getPerson(mockPerson.id).subscribe({
        next: person => {
          expect(person).toEqual(mockPerson);
          expect(person).toEqual(service.person);
        },
        error: fail
      });

      const req = httpTestingController.expectOne(url + mockPerson.id);
      expect(req.request.method).toEqual('GET');
      req.flush(mockPerson);
    })

    it('should turn 404 into a user-friendly error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      service.getPerson(mockPerson.id).subscribe({
        next: person => fail('expected to fail'),
        error: error => {
          expect(error).toEqual(errorResponse);
        }
      });

      const req = httpTestingController.expectOne(url + mockPerson.id);
      expect(req.request.method).toEqual('GET');
      req.flush(errorResponse,{...errorResponse});
    });
  })

  describe('add new suggest from friend', () => {
    let url;

    beforeEach(() => {
      url = `${service.httpUrl}/api/friends/add/`;
      service.person = mockPerson;
    })

    it('success add new suggest from friend', () => {
      let mockBody = { ...mockFiend, user: mockPerson };
      service.addFriends(mockPerson.id).subscribe({
        next: friend => {
          expect(friend).toEqual(mockBody);
          expect(service.person).toEqual({...service.person, suggest: [friend]})
        },
        error: fail
      });

      const req = httpTestingController.expectOne(url + mockPerson.id );
      expect(req.request.method).toEqual('POST');
      req.flush(mockBody); // Respond with no heroes
    })

    it('should turn 404 into a user-friendly error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse)

      service.addFriends(mockPerson.id).subscribe({
        next: heroes => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse),
      });

      const req = httpTestingController.expectOne(url + mockPerson.id);

      expect(req.request.method).toEqual('POST');
      req.flush(errorResponse, {...errorResponse});
    });
  })

  describe('confirmed friend proposal', () => {
    let url;
    let mockUser = {...UserClass, request: [mockFiend]};

    beforeEach(() => {
      url = `${service.httpUrl}/api/friends/confirm/`;
      service.person = {...mockPerson, request: [mockFiend]};
    })

    it('success confirmed', () => {
      service.confirmFriends(mockFiend.id).subscribe({
        next: user => {
          expect(user).toEqual(mockUser);
          expect(service.person).toEqual({...service.person, friends: [user]});
        },
        error: fail
      });

      const req = httpTestingController.expectOne(url + mockFiend.id);
      expect(req.request.method).toEqual('PUT');
      req.flush(mockUser);
    })

    it('should turn 404 into a confirmed friend', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse)

      service.confirmFriends(mockFiend.id).subscribe({
        next: user => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse),
      });

      const req = httpTestingController.expectOne(url + mockFiend.id);
      expect(req.request.method).toEqual('PUT');
      req.flush(errorResponse, {...errorResponse});
    });
  })

  describe('cancel friend offer, cancelFriend()', () => {
    let url;

    beforeEach(() => {
      url = `${service.httpUrl}/api/friends/cancel/`;
    })

    it('should cancel friend', () => {
      service.cancelFriend(mockFiend.id).subscribe({
        next: res => expect(res).toEqual(mockDeleteResult),
        error: fail
      });

      const req = httpTestingController.expectOne(url + mockFiend.id );
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockDeleteResult);
    })

    it('should turn 404 into a user-friendly error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      service.cancelFriend(mockFiend.id).subscribe({
        next: heroes => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse)
      });

      const req = httpTestingController.expectOne(url + mockFiend.id );
      expect(req.request.method).toEqual('DELETE');
      req.flush(errorResponse, {...errorResponse});
    });
  })

  describe('delete friend', () => {
    let url;
    let mockUser = UserClass;
    let person = {...mockPerson, friends: [mockUser]};

    beforeEach(() => {
      url = `${service.httpUrl}/api/friends/delete/${mockUser.id}`;
      service.person = person;
    })

    it('success delete friend', () => {
      service.deleteFriend(mockUser.id).subscribe({
        next: friends => {
          expect(friends.length).toEqual(0);
          expect(service.person.friends.length).toEqual(0);
        },
        error: fail
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush([]);
    })

    it('should turn 404 into a delete friend error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      service.deleteFriend(mockUser.id).subscribe({
        next: heroes => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse),
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(errorResponse, {...errorResponse});
    });
  })

  it('get person profile', () => {
    service.person$.next(mockPerson);

    service.personProfile.subscribe((person: UserInterface) => {
      expect(person).toEqual(mockPerson);
    })
  })
});
