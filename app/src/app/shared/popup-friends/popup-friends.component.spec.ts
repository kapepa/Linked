import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupFriendsComponent } from './popup-friends.component';
import {UserService} from "../../core/service/user.service";
import {PersonService} from "../../core/service/person.service";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {FriendClass} from "../../../utils/friend-class";
import {PipeModule} from "../../core/pipe/pipe.module";

describe('PopupFriendsComponent', () => {
  let component: PopupFriendsComponent;
  let fixture: ComponentFixture<PopupFriendsComponent>;
  let mockFriend = FriendClass;
  let mockUser = {...UserClass, suggest: [mockFriend]};

  let mockUserService = {
    getUser: of(mockUser),
    exceptRequest: (index) => of({}),
  };
  let mockPersonService = {
    confirmFriends: (friendID) => of({...mockUser, id: 'userFriendID'}),
    cancelFriend: (friendID) => of({...mockUser, id: 'userFriendID'}),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: PersonService, useValue: mockPersonService },
      ],
      declarations: [ PopupFriendsComponent ],
      imports: [
        PipeModule,
        IonicModule.forRoot(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupFriendsComponent);
    component = fixture.componentInstance;
    component.closePopupFriends = () => {};
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('accept friend add to friend', () => {
    spyOn(mockPersonService, 'confirmFriends').and.returnValue(of({...mockUser, id: 'userFriendID'}));
    spyOn(mockUserService, 'exceptRequest').and.returnValue(of({}));
    spyOn(component, 'closePopupFriends');
    let btn = fixture.debugElement.nativeElement.querySelector('ion-button#accept');

    btn.click();
    expect(mockPersonService.confirmFriends).toHaveBeenCalledWith(mockFriend.id);
    expect(mockUserService.exceptRequest).toHaveBeenCalledWith(mockUser.suggest.length -1);
    expect(component.closePopupFriends).toHaveBeenCalled();
  })

  it('decline offer add to friend', () => {
    spyOn(mockPersonService, 'cancelFriend').and.returnValue(of({...mockUser, id: 'userFriendID'}));
    spyOn(mockUserService, 'exceptRequest').and.returnValue(of({}));
    spyOn(component, 'closePopupFriends');
    let btn = fixture.debugElement.nativeElement.querySelector('ion-button#decline');

    btn.click();
    expect(mockPersonService.cancelFriend).toHaveBeenCalledWith(mockFriend.id);
    expect(mockUserService.exceptRequest).toHaveBeenCalledWith(mockUser.suggest.length -1);
    expect(component.closePopupFriends).toHaveBeenCalled();
  })

  it('get suggest length arr[]', () => {
    expect(component.getSuggest).toBeTruthy();
  })

});
