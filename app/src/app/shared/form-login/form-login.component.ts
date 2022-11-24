import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../core/service/auth.service";
import { Router } from "@angular/router";
import { ChatService } from "../../core/service/chat.service";
import { SocketService } from "../../core/service/socket.service";

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
  ) { }

  ngOnInit() {}

  onSubmit() {
    if(this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe(async () => {
      this.loginForm.reset();
      await this.socketService.createSocket();
      await this.router.navigate(['/']);
    })
  }

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }
}
