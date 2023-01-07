import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-popup-event',
  templateUrl: './popup-event.component.html',
  styleUrls: ['./popup-event.component.scss'],
})
export class PopupEventComponent implements OnInit, OnDestroy {
  @Input('closeEvent') closeEvent: () => void;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

  }

  async ngOnDestroy() {
    this.closeEvent();
  }

  onClose(e: Event) {
    this.closeEvent();
  }
}
