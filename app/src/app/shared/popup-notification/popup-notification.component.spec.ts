import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupNotificationComponent } from './popup-notification.component';

describe('PopupNotificationComponent', () => {
  let component: PopupNotificationComponent;
  let fixture: ComponentFixture<PopupNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupNotificationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupNotificationComponent);
    component = fixture.componentInstance;
    component.error = 'some error';
    component.title = 'Error';
    component.titleColor = 'red';
    component.closePopupNotification = () => {};
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close popup notification', () => {
    spyOn(component, 'onClose');
    let btn = fixture.debugElement.nativeElement.querySelector('ion-button.popup-notification__btn');

    btn.click();
    expect(component.onClose).toHaveBeenCalled();
  });

});
