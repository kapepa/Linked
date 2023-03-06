import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import { BasementComponent } from './basement.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {UserService} from "../../core/service/user.service";
import {of, Subscription} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {UserInterface} from "../../core/interface/user.interface";
import {ChatService} from "../../core/service/chat.service";
import {By} from "@angular/platform-browser";
import {Router} from "@angular/router";

class MockUserService {
  get getUser() { return of(UserClass as UserInterface) };
}

class MockChatService {
  get getNoRead() { return of(true) } ;
}




describe('BasementComponent', () => {
  let component: BasementComponent;
  let fixture: ComponentFixture<BasementComponent>;
  let router: Router;
  let userService: UserService;
  let chatService: ChatService;
  let popoverController: PopoverController;

  let userClass = UserClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasementComponent ],
      imports: [
        HttpClientTestingModule,
        IonicModule.forRoot()
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ChatService, useClass: MockChatService },
        { provide: PopoverController,
          useValue: {
            create: () => {
              return {
                present: async () => {},
                dismiss: () => {}
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BasementComponent);
    userService = TestBed.inject(UserService);
    chatService = TestBed.inject(ChatService);
    popoverController = TestBed.inject(PopoverController);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.ngOnInit();

    expect(component.user).toEqual(userClass as UserInterface);
    expect(component.noRead).toBeTruthy();
  })

  it('ngOnDestroy', () => {
    component.userSub = of().subscribe();
    component.noReadSub = of().subscribe();
    let unsubscriptionSpyUserSub = spyOn(component['userSub'], 'unsubscribe');
    let unsubscriptionSpyNoReadSub = spyOn(component['noReadSub'], 'unsubscribe');

    component.ngOnDestroy();
    expect(unsubscriptionSpyUserSub).toHaveBeenCalled();
    expect(unsubscriptionSpyNoReadSub).toHaveBeenCalled();
  })

  it('onClickBtn', () => {
    let spyRouter = spyOn(router, 'navigate');
    let button = fixture.debugElement.query(By.css('ion-tab-button'));

    button.nativeNode.click();
    expect(spyRouter).toHaveBeenCalledWith([`/`]);
  })

  it('onFriends', () => {
    let button = fixture.debugElement.query(By.css('.basement__friends'));
    let spyPopoverController = spyOn(popoverController, 'create').and.callFake((): any => ({dismiss: () => {}, present: async () => {}}))

    button.triggerEventHandler('click', { preventDefault: () => {} });
    expect(spyPopoverController).toHaveBeenCalled();
  })
});
