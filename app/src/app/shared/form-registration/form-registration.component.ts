import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../core/service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-form-registration',
  templateUrl: './form-registration.component.html',
  styleUrls: ['./form-registration.component.scss'],
})
export class FormRegistrationComponent implements OnInit {
  regForm = this.fb.group({
    firstName: ['TestName', [Validators.required, Validators.minLength(3)]],
    lastName: ['TestName', [Validators.required, , Validators.minLength(3)]],
    email: ['testEmail@mail.com', [Validators.required, , Validators.email]],
    password: ['testPassword', [Validators.required, , Validators.minLength(5)]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

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
