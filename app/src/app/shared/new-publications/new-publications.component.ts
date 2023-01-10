import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import { BehaviorSubject, from, Subscription } from "rxjs";
import { AuthService } from "../../core/service/auth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AdditionSearchComponent } from "../addition-search/addition-search.component";
import { PopupEventComponent } from "../popup-event/popup-event.component";

@Component({
  selector: 'app-new-publications',
  templateUrl: './new-publications.component.html',
  styleUrls: ['./new-publications.component.scss'],
})
export class NewPublicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  popoverEvent;
  createPopover;
  additionPopover;

  userAvatar: string;
  userAvatarSubscription: Subscription;

  query: {[key: string]: string | boolean | number};
  query$: BehaviorSubject<{[key: string]: string | boolean | number}> = new BehaviorSubject<{[key: string]: string | boolean | number}>({});

  @ViewChild('post') post: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.userAvatarSubscription = this.authService.userAvatar.subscribe((avatar: string) => this.userAvatar = avatar);

    this.route.queryParams.subscribe( async (query: Params) => {
      let { create, addition, event } = query;

      if( !!this.createPopover && (create === 'false' || create === false )) this.createPopover.dismiss();
      if( !!this.additionPopover && (addition === 'false' || addition === false )) this.additionPopover.dismiss();
      if( !!this.popoverEvent && event == 'true' ) this.popoverEvent.dismiss();

      if( query.hasOwnProperty('create') && JSON.parse(create) ) await this.createPublication();
      if( query.hasOwnProperty('addition') && JSON.parse(addition) ) await this.additionPublication();
      if( query.hasOwnProperty('event') && JSON.parse(event) ) await this.openEvent();

      this.setQuery = {...this.query, ...query};
    })
  }

  ngAfterViewInit() {
    // this.post['el'].click();
  }

  ngOnDestroy() {
    this.userAvatarSubscription.unsubscribe();
  }

  async cleanQuery(query: {[key: string]: string | boolean | number}, val: string) {
    let {[val]: current, ...other } = this.query;
    let queryHaveVal = Object.values(other);

    if(!queryHaveVal.includes('true') || !queryHaveVal.includes(true)){
      let setValFalse = Object.keys(other).reduce((accum, key) => accum[key] = false, {});
      this.setQuery = {...setValFalse, ...query};
      await this.router.navigate([],{ queryParams: query });
    }
  }

  async createPublication () {
    this.createPopover = await this.popoverController.create({
      component: CreatePublicationComponent,
      size: "cover",
      animated: false,
      componentProps: {
        type: 'create',
        onClosePublication: (query: {[key: string]: string | boolean | number }) => {
          this.cleanQuery(query, 'create')
        },
      },
      cssClass: 'new-publications__create',
    });

    return await this.createPopover.present();
  }

  async additionPublication () {
    this.additionPopover = await this.popoverController.create({
      component: AdditionSearchComponent,
      size: "cover",
      animated: false,
      componentProps: {
        type: 'create',
        onClosePublication: (query: {[key: string]: string | boolean | number }) => {
          this.cleanQuery(query, 'addition')
        }
      },
      cssClass: 'new-publications__create',
    });

    return await this.additionPopover.present();
  }

  async openEvent() {
    this.popoverEvent = await this.popoverController.create({
      component: PopupEventComponent,
      size: "cover",
      animated: false,
      componentProps: {
        closeEvent: (query: {[key: string]: string | boolean}) => {
          this.cleanQuery(query, 'event')
        },
      },
      cssClass: 'new-publications__create',
    });

    await this.popoverEvent.present();
  }

  set setQuery(query: {[key: string]: string | boolean | number}) {
    this.query = query;
    this.query$.next(this.query);
  }

  get getQuery() {
    return this.query$.asObservable();
  }

}
