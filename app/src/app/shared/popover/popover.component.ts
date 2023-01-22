import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from "../../core/service/auth.service";
import {Subscription} from "rxjs";
import {UserJwtDto} from "../../core/dto/user-jwt.dto";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {
  user: UserJwtDto;
  userSub: Subscription;
  @Input() closePresentPopover: () => void;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userSub = this.authService.getUser.subscribe((user: UserJwtDto) => this.user = user);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  async onSignOut(e: Event){
    this.closePresentPopover();
    await this.authService.logout();
  }


}
