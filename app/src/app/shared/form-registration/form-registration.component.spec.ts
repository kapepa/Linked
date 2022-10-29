import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormRegistrationComponent } from './form-registration.component';
import { AuthService } from "../../core/service/auth.service";
import { ReactiveFormsModule } from "@angular/forms";
import { of}  from "rxjs";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";

describe('FormRegistrationComponent', () => {
  let router: Router
  let component: FormRegistrationComponent;
  let fixture: ComponentFixture<FormRegistrationComponent>;

  let mockRegistration = {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@mail.com',
    password: 'password',
  }
  let mockAuthService = {
    registration: (form: FormData) => of(true),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [ {provide: AuthService, useValue: mockAuthService } ],
      declarations: [ FormRegistrationComponent ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormRegistrationComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.regForm.get('firstName').setValue(mockRegistration.firstName);
    component.regForm.get('lastName').setValue(mockRegistration.lastName);
    component.regForm.get('email').setValue(mockRegistration.email);
    component.regForm.get('password').setValue(mockRegistration.password);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit form registration', () => {
    let formData = new FormData();
    let navigateSpy = spyOn(router, 'navigate');
    let form = fixture.debugElement.query(By.css('form#form'));
    spyOn(mockAuthService, 'registration').and.returnValue(of(true));
    formData.append('firstName',  mockRegistration.firstName);
    formData.append('lastName',  mockRegistration.lastName);
    formData.append('email',  mockRegistration.email);
    formData.append('password',  mockRegistration.password);

    form.triggerEventHandler('submit', null);
    expect(mockAuthService.registration).toHaveBeenCalledWith(formData);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login'])
  })

  it('get firstName', () => {
    expect(component.firstName.value).toEqual(mockRegistration.firstName);
  })

  it('get lastName', () => {
    expect(component.lastName.value).toEqual(mockRegistration.lastName);
  })

  it('get email', () => {
    expect(component.email.value).toEqual(mockRegistration.email);
  })

  it('get password', () => {
    expect(component.password.value).toEqual(mockRegistration.password);
  })
});
