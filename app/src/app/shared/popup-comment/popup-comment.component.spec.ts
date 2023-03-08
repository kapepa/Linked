import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupCommentComponent } from './popup-comment.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('PopupCommentComponent', () => {
  let component: PopupCommentComponent;
  let fixture: ComponentFixture<PopupCommentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PopupCommentComponent,
      ],
      imports: [
        IonicModule.forRoot()
      ],
      providers: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onClose', () => {
    component.closePopup = () => {};
    let divClose = fixture.debugElement.query(By.css('.popup-comment__close'));

    divClose.nativeElement.click();

    expect(component.closePopup).toBeTruthy();
  })
});
