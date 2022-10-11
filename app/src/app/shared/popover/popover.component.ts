import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from "../../core/service/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {
  userAvatar: string;
  userAvatarSubscription: Subscription;
  @Input() closePresentPopover: () => void;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userAvatarSubscription = this.authService.userAvatar.subscribe((avatar: string) => {
      console.log(avatar)
      this.userAvatar = avatar
    })
  }

  ngOnDestroy() {
    this.userAvatarSubscription.unsubscribe();
  }

  onSignOut(e: Event){
    this.closePresentPopover();
    this.authService.logout();
  }


}
