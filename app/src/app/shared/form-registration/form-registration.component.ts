import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {}

  onSubmit() {
    if(this.regForm.invalid) return ;
    console.log(this.regForm.value);
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
