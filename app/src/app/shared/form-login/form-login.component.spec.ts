import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormLoginComponent } from './form-login.component';
import { ReactiveFormsModule } from "@angular/forms";
import {AuthService} from "../../core/service/auth.service";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";
import {Router} from "@angular/router";

describe('FormLoginComponent', () => {
  let router: Router;
  let component: FormLoginComponent;
  let fixture: ComponentFixture<FormLoginComponent>;
  let mockLogin = { email: 'test@mail.com', password: '12345' }

  let mockAuthService = {
    login: (obj) => of({}),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
      declarations: [
        FormLoginComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        IonicModule.forRoot(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormLoginComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.loginForm.get('email').setValue(mockLogin.email);
    component.loginForm.get('password').setValue(mockLogin.password);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit form login', () => {
    let form = fixture.debugElement.query(By.css('form'));
    let navigateSpy = spyOn(router, 'navigate');
    spyOn(mockAuthService, 'login').and.returnValue(of({}));

    form.triggerEventHandler('submit', null);
    expect(mockAuthService.login).toHaveBeenCalledWith({ email: mockLogin.email, password: mockLogin.password });
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('get email', () => {
    expect(component.email.value).toEqual(mockLogin.email);
  })

  it('get password', () => {
    expect(component.password.value).toEqual(mockLogin.password);
  })

});
