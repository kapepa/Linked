import {TestBed} from '@angular/core/testing';
import {EventService} from './event.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HttpService} from "./http.service";
import {EventClass} from "../../../utils/event-class";
import {UserClass} from "../../../utils/user-class";
import {EventInterface} from "../interface/event.interface";
import {EventDto} from "../dto/event.dto";
import {of} from "rxjs";
import {asyncError} from "../../../testing/async-observable-helpers";

describe('EventService', () => {
  let userClass = UserClass;
  let eventClass = EventClass;

  let service: EventService;
  let httpServiceSpy: HttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        EventService,
        { provide: HttpService, useValue: { handleError: () => {} } }
      ]
    });

    service = TestBed.inject(EventService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('to form data. inForm', () => {
    let obj = { key: 'value' };
    let toForm = service.inForm(obj);

    expect(toForm).toEqual(new FormData());
  })

  describe('createEvent', () => {
    let testUrl: string;
    let mockEvent = eventClass as EventDto;

    beforeEach(() => {
      testUrl = `${service.configUrl}/api/event/create`;
    })

    it('should create event', (done: DoneFn) => {
      service.createEvent(mockEvent).subscribe({
        next: (event: EventInterface) => {
          expect(event).toEqual(eventClass);
          done();
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('POST');
      req.flush(eventClass);
    })

    it('should be error 404 event', (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' })
      spyOn(httpServiceSpy, 'handleError').and.returnValue(asyncError(errorResponse))

      service.createEvent(mockEvent).subscribe({
        next: () => fail('should have failed with the 404 error'),
        error: (err) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('error', errorResponse);
    })
  })

  describe('oneEvent', () => {
    let mockUrl: string;
    let mockID: string;
    let mockEvent: EventInterface;

    beforeEach(() => {
      mockID = eventClass.id as string;
      mockUrl = `${service.configUrl}/api/event/one/${mockID}`;
      mockEvent = eventClass;
    })

    it('should return event on id', (done: DoneFn) => {
      service.oneEvent(mockID).subscribe({
        next: (event: EventInterface) => {
          expect(event).toEqual(mockEvent);
          done();
        },
        error: () => done.fail,
      })

      let req = httpTestingController.expectOne(mockUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(mockEvent);
    })

    it('can test for 404 error', (done: DoneFn) => {
      let errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      spyOn(httpServiceSpy, 'handleError').and.returnValue(asyncError(errorResponse));

      service.oneEvent(mockID).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      })

      let req = httpTestingController.expectOne(mockUrl);
      req.flush('error', errorResponse);
    })
  })

  describe("listEvent", () => {
    let mockUrl: string;
    let mockQuery: {take?: number, skip?: number};
    let mockEvent: EventInterface[];

    beforeEach(() => {
      mockQuery = {take: 1, skip: 0};
      mockUrl = `${service.configUrl}/api/event/list?take=${mockQuery.take}&skip=${mockQuery.skip}`;
      mockEvent = [eventClass];
    })

    it('should return array events', (done: DoneFn) => {
      service.listEvent(mockQuery).subscribe({
        next: (events: EventInterface[]) => {
          expect(events).toEqual(mockEvent);
          done();
        },
        error: () => done.fail,
      })

      let req = httpTestingController.expectOne(mockUrl);
      expect(req.request.method).toEqual("GET");
      req.flush(mockEvent);
    })

    it('can test for 404 error', (done: DoneFn) => {
      let errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      spyOn(httpServiceSpy, 'handleError').and.returnValue(asyncError(errorResponse));

      service.listEvent(mockQuery).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      })

      let req = httpTestingController.expectOne(mockUrl);
      req.flush('error', errorResponse);
    })
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set and get event loader. setEventLoader, setEventLoader', () => {
    service.setEventLoader = true;
    service.getEventLoader.subscribe({
      next: (bool: boolean) => expect(bool).toBeTruthy(),
    })
  })

  it('set and get event. getEvents, setEvent', () => {
    service.setEvent = eventClass;
    service.getEvent.subscribe({
      next: (event: EventInterface) => { expect(event).toEqual(eventClass) }
    })
  })

  it('set and get events. setEvents, getEvents', () => {
    service.setEvents = [eventClass];
    service.getEvents.subscribe({
      next: (events: EventInterface[]) => {
        expect(events).toEqual([eventClass]);
      }
    })
  })
});
