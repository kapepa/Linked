import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AsideEventComponent} from './aside-event.component';
import {RouterTestingModule} from "@angular/router/testing";
import {EventClass} from "../../../utils/event-class";
import {EventInterface} from "../../core/interface/event.interface";

describe('AsideEventComponent', () => {
  let component: AsideEventComponent;
  let fixture: ComponentFixture<AsideEventComponent>;

  let classEvent = EventClass as EventInterface;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AsideEventComponent,
      ],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AsideEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('eventWill', () => {

    let mockDate = new Date(Date.now() + 1000 * 60 * 60);
    let mockTime = '10:00';
    let eventWill = component.eventWill(mockDate, mockTime);

    expect(eventWill).toEqual('today in 10:00')
  })

});
