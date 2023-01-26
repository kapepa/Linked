import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverComponent } from './popover.component';
import {AuthService} from "../../core/service/auth.service";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";

describe('PopoverComponent', () => {
  let component: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;
  let mockUser = UserClass;

  let mockAuthService = {
    getUser: of(mockUser),
    logout: () => {},
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      declarations: [ PopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    component.closePresentPopover = () => {};
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sing out from account', () => {
    spyOn(mockAuthService, 'logout');
    let signOut = fixture.debugElement.nativeElement.querySelector('ion-card-subtitle#sign_out');

    signOut.click();
    expect(mockAuthService.logout).toHaveBeenCalled();
  })

});
