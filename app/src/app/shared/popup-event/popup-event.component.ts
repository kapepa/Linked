import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-popup-event',
  templateUrl: './popup-event.component.html',
  styleUrls: ['./popup-event.component.scss'],
})
export class PopupEventComponent implements OnInit, OnDestroy {
  @Input('closeEvent') closeEvent: () => void;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.router.navigate([], {queryParams: {}})
  }
}
