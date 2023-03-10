import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventDetailedComponent } from './event-detailed.component';
import {EventService} from "../../core/service/event.service";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {EventClass} from "../../../utils/event-class";
import {EventInterface} from "../../core/interface/event.interface";
import {By} from "@angular/platform-browser";

class MockEventService {
  get getEvent() { return of({}) };
  get getEvents() { return of([]) }
}

describe('EventDetailedComponent', () => {
  let component: EventDetailedComponent;
  let fixture: ComponentFixture<EventDetailedComponent>;
  let eventService: EventService;

  let eventClass = EventClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDetailedComponent ],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: EventService, useClass: MockEventService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailedComponent);
    eventService = TestBed.inject(EventService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    let mockEventClass = eventClass as  EventInterface;
    let spyGetEvent = spyOnProperty(eventService, 'getEvent', 'get').and.callFake(() => of(mockEventClass));
    let spyGetEvents = spyOnProperty(eventService, 'getEvents', 'get').and.callFake(() => of([mockEventClass]));

    component.ngOnInit();
    expect(spyGetEvent).toHaveBeenCalled();
    expect(spyGetEvents).toHaveBeenCalled();
    expect(component.event).toEqual(mockEventClass);
    expect(component.events).toEqual([mockEventClass]);
  })

  it('ngOnDestroy', () => {
    component.eventSub = of({}).subscribe();
    component.eventsSub = of([]).subscribe();
    let spyEventSub = spyOn(component.eventSub, 'unsubscribe');
    let spyEventsSub = spyOn(component.eventsSub, 'unsubscribe');

    component.ngOnDestroy();
    expect(spyEventSub).toHaveBeenCalled();
    expect(spyEventsSub).toHaveBeenCalled();
  })

  it('onAddition', () => {
    let divClick = fixture.debugElement.queryAll(By.css('.event-detailed__addition'))[1];

    divClick.nativeNode.click();
    expect(component.addition).toEqual('comment');
  })

  it('getDate', () => {
    component.event = eventClass as EventInterface;
    fixture.detectChanges();

    let getDate = component.getDate;
    expect(getDate).toEqual(new Date((eventClass as EventInterface).date as Date))
  })

  it('getDateMeeting', () => {
    component.event = eventClass as EventInterface;
    fixture.detectChanges();

    let getDateMeeting = component.getDateMeeting;
    expect(getDateMeeting).toEqual(`${component.getDate.getDate()} ${component.monthNames[component.getDate.getMonth()]} ${component.getDate.getFullYear()}`)
  })

  describe('eventWill', () => {
    it('should return today', () => {
      component.event = eventClass as EventInterface;
      fixture.detectChanges();

      expect(component.eventWill).toEqual('today');
    })

    it('should return today', () => {
      component.event = {...eventClass, date: new Date(Date.now() + 1000 * 60 * 60 * 24)} as EventInterface;
      fixture.detectChanges();

      expect(component.eventWill).toEqual('tomorrow');
    })

    it('should return is over', () => {
      component.event = {...eventClass, date: new Date(Date.now() - 1000 * 60 * 60 * 24)} as EventInterface;
      fixture.detectChanges();

      expect(component.eventWill).toEqual('is over');
    })
  })

  it('getTapeEvent', () => {
    component.event = eventClass as EventInterface;
    component.events = [eventClass] as EventInterface[];
    fixture.detectChanges();

    expect(component.getTapeEvent).toEqual([]);
  })
});
