import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import { BehaviorSubject, from, Subscription } from "rxjs";
import { AuthService } from "../../core/service/auth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AdditionSearchComponent } from "../addition-search/addition-search.component";
import { PopupEventComponent } from "../popup-event/popup-event.component";
import {key} from "ionicons/icons";

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

  query: {[key: string]: string | boolean};
  query$: BehaviorSubject<{[key: string]: string | boolean}> = new BehaviorSubject<{[key: string]: string | boolean}>({});

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

      if( query.hasOwnProperty('create') && JSON.parse(create) )
        from(this.createPublication()).subscribe(() => this.setQuery = this.changeQueryVal(query, 'create') );
      if( query.hasOwnProperty('addition') && JSON.parse(addition) )
        from(this.additionPublication()).subscribe(() => this.setQuery = query);
      if( query.hasOwnProperty('event') && JSON.parse(event) )
        from(this.openEvent()).subscribe(() => this.setQuery = query);
    })

    this.query$.subscribe(( query: {[key: string]: string | boolean} ) => {
      let { create, addition, event } = query;

      if( !!this.createPopover && create == 'false') this.createPopover.dismiss();
      if( !!this.additionPopover && addition == 'false') this.additionPopover.dismiss();
      if( !!this.popoverEvent && event == 'false') this.popoverEvent.dismiss();
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

  changeQueryVal(query: {[key: string]: string | boolean}, val: string) {
    let copyList = { ...query };
    for (let key in copyList) key === val ? copyList[key] = true : copyList[key] = false;
    return copyList;
  }

  async cleanQuery(key: string) {
    if(this.query[key] == 'true')
      await this.router.navigate([],{queryParams: {...this.query, [key]: false }});
  }

  async createPublication () {
    this.createPopover = await this.popoverController.create({
      component: CreatePublicationComponent,
      size: "cover",
      animated: false,
      componentProps: {
        type: 'create',
        queryParam: this.query,
        onClosePublication: () => {
          // this.createPopover.dismiss();
          this.cleanQuery('create');
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
        query: this.query,
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
        },
      },
      cssClass: 'new-publications__create',
    });

    await this.popoverEvent.present();
  }

  set setQuery(query: {[key: string]: string | boolean}) {
    this.query = query;
    this.query$.next(this.query);
  }

  get getQuery() {
    return this.query$.asObservable();
  }

}
