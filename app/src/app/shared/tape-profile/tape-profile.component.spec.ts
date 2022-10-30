import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TapeProfileComponent } from './tape-profile.component';
import {AuthService} from "../../core/service/auth.service";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {By} from "@angular/platform-browser";

describe('TapeProfileComponent', () => {
  let component: TapeProfileComponent;
  let fixture: ComponentFixture<TapeProfileComponent>;
  let mockUser = UserClass;

  let mockAuthService = {
    getUser: of(mockUser),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
      declarations: [ TapeProfileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TapeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('avatar click', () => {
    spyOn(component, 'onAvatar');
    let avatar = fixture.debugElement.nativeElement.querySelector('ion-avatar');

    avatar.click();
    expect(component.onAvatar).toHaveBeenCalled();
  })

  it('avatar load', () => {
    spyOn(component, 'onFile');
    let file = fixture.debugElement.query(By.css('#file'));

    file.triggerEventHandler('change', null);
    expect(component.onFile).toHaveBeenCalled();
  })
});
