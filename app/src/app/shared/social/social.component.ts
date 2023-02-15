import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../core/service/auth.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent implements OnInit {
  baseUrl = environment.configUrl;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {

  }

  onSocial(social: string) {
    if(social === 'google') this.onGoogle();
    if(social === 'facebook') this.onFacebook();
  }

  onGoogle() {
    let auth = window
    auth.open(`${this.baseUrl}/api/auth/google`,"_blank","width=500,height=500,left=0,top=0");
    auth.addEventListener('message', (e: MessageEvent) => {
      console.log(e.data)
    })
  }

  onFacebook() {
    console.log('facebook')
  }
}
