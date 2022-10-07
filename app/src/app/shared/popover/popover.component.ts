import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../core/service/auth.service";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() closePresentPopover: () => void;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {}

  onSignOut(e: Event){
    this.closePresentPopover();
    this.authService.logout();
  }


}
