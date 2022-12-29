import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { CreatePublicationComponent } from "../create-publication/create-publication.component";
import { BehaviorSubject, Subscription } from "rxjs";
import { AuthService } from "../../core/service/auth.service";
import { Router, Event, ActivatedRoute, Params } from "@angular/router";
import {AdditionSearchComponent} from "../addition-search/addition-search.component";

@Component({
  selector: 'app-new-publications',
  templateUrl: './new-publications.component.html',
  styleUrls: ['./new-publications.component.scss'],
})
export class NewPublicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  createPopover
  additionPopover

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
      if( query?.open && query?.open === 'create' ) {
        if(!!this.additionPopover) this.additionPopover.dismiss();
        await this.createPublication();
      }
      if( query?.open && query?.open === 'addition' ) {
        if(!!this.createPopover) this.createPopover.dismiss();
        await this.additionPublication();
      }
    })
  }

  ngAfterViewInit() {
    // this.post['el'].click();
  }

  ngOnDestroy() {
    this.userAvatarSubscription.unsubscribe();

  }

  closePublication(){
    console.log('close')
  }

  async createPublication () {
    this.createPopover = await this.popoverController.create({
      component: CreatePublicationComponent,
      size: "cover",
      animated: false,
      componentProps: { onClosePublication: () => {
          this.createPopover.dismiss();
          this.router.navigate([window.location.pathname], {queryParams: {}});
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
          this.additionPopover.dismiss();
          this.router.navigate([window.location.pathname], {queryParams: {}});
        }
      },
      cssClass: 'new-publications__create',
    });

    return await this.additionPopover.present();
  }

  set setQuery(query: string) {
    this.query = query;
    this.query$.next(this.query);
  }

  get getQuery() {
    return this.query$.asObservable();
  }

}
