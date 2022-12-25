import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-addition-search',
  templateUrl: './addition-search.component.html',
  styleUrls: ['./addition-search.component.scss'],
})
export class AdditionSearchComponent implements OnInit, OnDestroy {
  @Input() onClosePublication: () => void;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {}

  async ngOnDestroy() {
    if (this.route.snapshot.queryParams?.open !== 'create')
      await this.router.navigate([window.location.pathname], {queryParams: { }});
  }

  onClose(e: Event) {
    this.onClosePublication()
  }
}
