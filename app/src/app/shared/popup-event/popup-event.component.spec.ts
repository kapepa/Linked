import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PopupEventComponent} from './popup-event.component';
import {RouterTestingModule} from "@angular/router/testing";
import {EventService} from "../../core/service/event.service";
import {RadioModule} from "../radio/radio.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";
import {FileReaderModule} from "../file-reader/file-reader.module";

class MockEventService {

}

describe('PopupEventComponent', () => {
  let component: PopupEventComponent;
  let fixture: ComponentFixture<PopupEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupEventComponent ],
      imports: [
        RadioModule,
        FormsModule,
        FileReaderModule,
        RouterTestingModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: EventService, useClass: MockEventService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onClose', () => {
    component.closeEvent = () => {};
    let button = fixture.debugElement.query(By.css('.popup-event__close'));

    button.nativeNode.click();
    expect(component.closeEvent).toBeTruthy();
  })

  it('onEmpty', () => {
    let divEmpty = fixture.debugElement.query(By.css('.popup-event__empty'));
    let spyEmpty = spyOn(component, 'onEmpty');

    divEmpty.nativeNode.click();

    expect(spyEmpty).toHaveBeenCalled();
  })

  it('onChange', () => {
    let mockEvent = { target: { files: {0: new File([new Blob(['1'.repeat(1024 * 1024 + 1)], { type: 'image/png' })], 'test-file.pdf')} } }
    let changeFile = fixture.debugElement.query(By.css('.popup-event__file'));

    changeFile.triggerEventHandler('change', mockEvent)

    expect(component.getImg?.value).toEqual(mockEvent.target.files[0]);
  })

  it('onRadioChange', () => {
    let mockRadio = 'online';

    component.onRadioChange(mockRadio);
    expect(component.getType?.value).toEqual(mockRadio);
  })

  it('getImg', () => {
    let fakeImg = 'fakeImg.png';
    component.eventForm.get('img')?.patchValue(fakeImg);

    expect(component.getImg?.value).toEqual(fakeImg);
  })

  it('getType', () => {
    let fakeType: string = 'online';
    component.eventForm.get('type')?.patchValue(fakeType);

    expect(component.getType?.value).toEqual(fakeType);
  })

  it('getTitle', () => {
    let fakeTitle: string = 'FakeTitle';
    component.eventForm.get('title')?.patchValue(fakeTitle);

    expect(component.getTitle?.value).toEqual(fakeTitle);
  })

  it('getDate', () => {
    let fakeDate: Date = new Date(Date.now());
    component.eventForm.get('date')?.patchValue(fakeDate);

    expect(component.getDate?.value).toEqual(fakeDate);
  })

  it('getTime', () => {
    let fakeTime: string = '10:30';
    component.eventForm.get('time')?.patchValue(fakeTime);

    expect(component.getTime?.value).toEqual(fakeTime);
  })

  it('getLink', () => {
    let fakeLink: string = 'fakeLink';
    component.eventForm.get('link')?.patchValue(fakeLink);

    expect(component.getLink?.value).toEqual(fakeLink);
  })

  it('getDescription', () => {
    let fakeDescription: string = 'fakeDescription';
    component.eventForm.get('description')?.patchValue(fakeDescription);

    expect(component.getDescription?.value).toEqual(fakeDescription);
  })
});
