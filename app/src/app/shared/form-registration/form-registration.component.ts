import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../core/service/auth.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-form-registration',
  templateUrl: './form-registration.component.html',
  styleUrls: ['./form-registration.component.scss'],
})
export class FormRegistrationComponent implements OnInit {
  regForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, , Validators.minLength(3)]],
    email: ['', [Validators.required, , Validators.email]],
    password: ['', [Validators.required, , Validators.minLength(5)]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd){
        if(event.url === '/auth/login') this.regForm.clearValidators();
      }
    });
  }

  ngOnInit() {}

  onSubmit() {
    if(this.regForm.invalid) return;
    const from = new FormData();
    const formValues = this.regForm.value;

    Object.keys(formValues).forEach( key => from.append(key, formValues[key]));

    this.authService.registration(from).subscribe((bol: boolean) => {
      if(bol){
        this.router.navigate(['/auth/login']);
        this.regForm.reset();
      }
    });
  }

  get firstName() {
    return this.regForm.get('firstName');
  }

  get lastName() {
    return this.regForm.get('lastName')
  }

  get email() {
    return this.regForm.get('email')
  }

  get password() {
    return this.regForm.get('password')
  }
}
