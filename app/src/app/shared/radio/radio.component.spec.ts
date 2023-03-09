import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadioComponent } from './radio.component';
import {By} from "@angular/platform-browser";

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onRadio', () => {
    let mockList: { name: string, val: string }[] = [{name: 'fakeName', val: 'fakeVal'}];
    component.list = mockList;
    fixture.detectChanges();

    let spyRadioChange = spyOn(component.onRadioChange, 'emit');
    let itemClick = fixture.debugElement.query(By.css('.radio__item'));

    itemClick.nativeElement.click();
    expect(spyRadioChange).toHaveBeenCalledWith('fakeVal');
  })
});
