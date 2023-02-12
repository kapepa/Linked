import { Component, OnInit } from '@angular/core';
import {FormBuilder, NgForm, Validators} from "@angular/forms";
import { AuthService } from "../../core/service/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { ChatService } from "../../core/service/chat.service";
import { SocketService } from "../../core/service/socket.service";
import { ReCaptchaV3Service } from "ng-recaptcha";

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss'],
})
export class FormLoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private chatService: ChatService,
    private socketService: SocketService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd){
        if(event.url === '/auth/registration') this.loginForm.reset();
        this.loginForm.markAsPristine();
        this.loginForm.markAsUntouched();
        this.loginForm.updateValueAndValidity();
      }
    });
  }

  ngOnInit() {}

  onSubmit() {
    if(this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;

    this.recaptchaV3Service.execute('importantAction')
      .subscribe((token: string) => {
        // console.log(`Token [${token}] generated`);

        this.authService.login({ email, password }).subscribe(async () => {
          this.loginForm.reset();
          await this.socketService.createSocket();
          await this.router.navigate(['/']);
        })
      });
  }

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }
}
