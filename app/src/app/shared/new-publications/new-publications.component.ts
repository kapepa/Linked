import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import { BehaviorSubject, Subscription } from "rxjs";
import { AuthService } from "../../core/service/auth.service";
import { Router, Event, ActivatedRoute, Params } from "@angular/router";
import { AdditionSearchComponent } from "../addition-search/addition-search.component";
import {PopupEventComponent} from "../popup-event/popup-event.component";

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

  query: string;
  query$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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
      // let params = this.route.snapshot.queryParams;
      //
      // console.log(params, query)
      // console.log()

      if(!!this.createPopover) this.createPopover.dismiss();
      if(!!this.additionPopover) this.additionPopover.dismiss();
      if(!!this.popoverEvent) this.popoverEvent.dismiss();

      if( query.hasOwnProperty('create') && !!query?.create ) await this.createPublication();
      if( query.hasOwnProperty('addition') && !!query?.addition ) await this.additionPublication();
      if( query.hasOwnProperty('event') && !!query?.event ) await this.openEvent();
    })
  }

  ngAfterViewInit() {
    // this.post['el'].click();
  }

  ngOnDestroy() {
    this.userAvatarSubscription.unsubscribe();

  }

  closePublication(){

  }

  async cleanQuery(key: string) {
    let query = this.route.snapshot.queryParams;

    console.log(query.hasOwnProperty(key))

    if( query.hasOwnProperty(key) ) {
      let { [key]: exclude, ...other } = query;
      await this.router.navigate([],{queryParams: other});
    }
  }

  async createPublication () {
    this.createPopover = await this.popoverController.create({
      component: CreatePublicationComponent,
      size: "cover",
      animated: false,
      componentProps: {
        type: 'create',
        onClosePublication: () => {
          // this.createPopover.dismiss();
          this.cleanQuery('create');
        }
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
        onClosePublication: () => {
          // this.additionPopover.dismiss();
          this.cleanQuery('addition');
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
        closeEvent: () => {
          // this.popoverEvent.dismiss();
          this.cleanQuery('edit');
          // let { event, ...other } = this.route.snapshot.queryParams;
          // this.router.navigate([window.location.pathname], { queryParams: other });
        },
      },
      cssClass: 'new-publications__create',
    });

    await this.popoverEvent.present();
  }

  set setQuery(query: string) {
    this.query = query;
    this.query$.next(this.query);
  }

  get getQuery() {
    return this.query$.asObservable();
  }

}
