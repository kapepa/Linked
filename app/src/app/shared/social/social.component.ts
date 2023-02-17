import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../core/service/auth.service";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent implements OnInit {
  baseUrl = environment.configUrl;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {

  }

  onSocial(social: string) {
    if(social === 'google') this.onGoogle();
    if(social === 'facebook') this.onFacebook();
  }

  messageEvent(e: MessageEvent) {
    if (!e.data) return window.removeEventListener('message', this.messageEvent);
    this.authService.socialAuth(e.data).subscribe(() => {
      window.removeEventListener('message', this.messageEvent);
      this.router.navigate(['/home']);
    })
  }

  onGoogle() {
    let auth = window;
    auth.open(`${this.baseUrl}/api/auth/google`,"_blank","width=500,height=500,left=0,top=0");
    auth.addEventListener('message', this.messageEvent.bind(this));
  }

  onFacebook() {
    let auth = window;
    auth.open(`${this.baseUrl}/api/auth/facebook`,"_blank","width=500,height=500,left=0,top=0");
    auth.addEventListener('message', this.messageEvent.bind(this));
  }
}
