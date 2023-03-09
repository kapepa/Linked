import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {SocialComponent} from './social.component';
import {AuthService} from "../../core/service/auth.service";
import {UserDto} from "../../core/dto/user.dto";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

class MockAuthService {
  socialAuth(user: UserDto) {}
}

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;
  let authService: AuthService;
  let router: Router;

  let userClass = UserClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialComponent ],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  describe('onSocial', () => {
    it('call onGoogle', () => {
      let spyGoogle = spyOn(component, 'onGoogle');

      component.onSocial('google');
      expect(spyGoogle).toHaveBeenCalled();
    })

    it('call onFacebook', () => {
      let spyFacebook = spyOn(component, 'onFacebook');

      component.onSocial('facebook');
      expect(spyFacebook).toHaveBeenCalled();
    })
  })

  it('messageEvent', () => {
    let mockUserClass: UserDto = userClass as UserDto;
    let spyRouter = spyOn(router, 'navigate');
    let spyMessageEvent = spyOn(authService, 'socialAuth').and.callFake((user: UserDto) => { return of({access_token: 'myToken'}) });

    component.messageEvent({data: mockUserClass} as MessageEvent);
    expect(spyMessageEvent).toHaveBeenCalledWith(mockUserClass);
    expect(spyRouter).toHaveBeenCalledWith(['/home']);
  })

  it('onGoogle', () => {
    let spyOpen = spyOn(window, 'open');

    component.onGoogle();
    expect(spyOpen).toHaveBeenCalled();
  })

  it('onFacebook', () => {
    let spyOpen = spyOn(window, 'open');

    component.onFacebook();
    expect(spyOpen).toHaveBeenCalled();
  })
});
