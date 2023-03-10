import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {TapeFriendsComponent} from './tape-friends.component';
import {ChatService} from "../../core/service/chat.service";
import {Router} from "@angular/router";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {UserInterface} from "../../core/interface/user.interface";
import {By} from "@angular/platform-browser";
import {ChatClass} from "../../../utils/chat-class";
import {ChatInterface} from "../../core/interface/chat.interface";

class MockChatService {
  get getFriends() { return of() };
  get getActiveConversation() { return of() };
  get getNoReadFriend() { return of() };
  changeActiveConversation(id: string, index: number) { return of() }
}

describe('TapeFriendsComponent', () => {
  let component: TapeFriendsComponent;
  let fixture: ComponentFixture<TapeFriendsComponent>;
  let router: Router;
  let chatService: ChatService;

  let userClass = UserClass;
  let chatClass = ChatClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TapeFriendsComponent],
      imports: [
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: ChatService, useClass: MockChatService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TapeFriendsComponent);
    chatService = TestBed.inject(ChatService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    let mockFriends = [userClass] as UserInterface[];
    let mockActiveConversationID: string = 'fakeID';
    let mockNoReadFriend = ['fakeFriendID'];

    spyOnProperty(chatService, 'getFriends').and.callFake(() => of(mockFriends));
    spyOnProperty(chatService, 'getActiveConversation').and.callFake(() => of(mockActiveConversationID));
    spyOnProperty(chatService, 'getNoReadFriend').and.callFake(() => of(mockNoReadFriend));

    component.ngOnInit();

    expect(component.friends).toEqual(mockFriends);
    expect(component.activeConversation).toEqual(mockActiveConversationID);
    expect(component.noRead).toEqual(mockNoReadFriend);
  })

  it('ngOnDestroy', () => {
    component.friendsSub = of({}).subscribe();
    component.activeConversationSub = of({}).subscribe();
    component.noReadSub = of({}).subscribe();
    let spyFriendsSub = spyOn(component.friendsSub, 'unsubscribe');
    let spyActiveConversationSub = spyOn(component.activeConversationSub, 'unsubscribe');
    let spyNoReadSub = spyOn(component.noReadSub, 'unsubscribe');

    component.ngOnDestroy();

    expect(spyFriendsSub).toHaveBeenCalled();
    expect(spyActiveConversationSub).toHaveBeenCalled();
    expect(spyNoReadSub).toHaveBeenCalled();
  })

  it('loadData', () => {
    let infiniteScroll = fixture.debugElement.query(By.css('ion-infinite-scroll'));

    infiniteScroll.triggerEventHandler('ionInfinite', {});
  })

  it('onFriends', () => {
    component.friends = [userClass] as UserInterface[];
    fixture.detectChanges();

    let spyActiveConversation = spyOn(chatService, 'changeActiveConversation').and.callFake((id: string, index: number) => of(chatClass as ChatInterface))
    let divFriends = fixture.debugElement.query(By.css('.tape-friends__item'));
    let spyRouter = spyOn(router, 'navigate');
    spyOnProperty(router, 'url', 'get').and.returnValue('/chat/mobile/friends');

    divFriends.nativeElement.click();
    expect(spyActiveConversation).toHaveBeenCalledWith(userClass.id as string, 0);
    expect(spyRouter).toHaveBeenCalledWith(['chat/mobile/message']);
  })
});
