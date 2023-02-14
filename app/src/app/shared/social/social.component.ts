import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  onSocial(social: string) {
    if(social === 'google') this.onGoogle();
    if(social === 'facebook') this.onFacebook();
  }

  onGoogle() {
    console.log('google')
  }

  onFacebook() {
    console.log('facebook')
  }
}
