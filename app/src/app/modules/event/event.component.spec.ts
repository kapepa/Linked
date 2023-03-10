import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventComponent } from './event.component';
import {EventService} from "../../core/service/event.service";
import {of} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {NewsClass} from "../../../utils/news-class";
import {EventInterface} from "../../core/interface/event.interface";

class MockEventService {
  get getEvents() { return of() }
}

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let eventService: EventService;

  let newsClass = NewsClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventComponent ],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: EventService, useClass: MockEventService },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventComponent);
    eventService = TestBed.inject(EventService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    let spyNews = [newsClass] as EventInterface[];
    let spyGetEvents = spyOnProperty(eventService, 'getEvents', 'get').and.callFake(() => of(spyNews));

    component.ngOnInit();
    expect(spyGetEvents).toHaveBeenCalled();
    expect(component.events).toEqual(spyNews);
  })

  it('ngOnDestroy', () => {
    component.eventsSub = of().subscribe();
    let spyEventsSub = spyOn(component.eventsSub, 'unsubscribe');

    component.ngOnDestroy();
    expect(spyEventsSub).toHaveBeenCalled();
  })
});
