import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PersonComponent } from './person.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AuthService} from "../../core/service/auth.service";
import {RouterTestingModule} from "@angular/router/testing";
import {of, from, Observable} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {UserDto} from "../../core/dto/user.dto";
import {PersonService} from "../../core/service/person.service";
import {FriendClass} from "../../../utils/friend-class";
import {FriendDto} from "../../core/dto/friend.dto";
import {UserInterface} from "../../core/interface/user.interface";

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  let mockUser = UserClass as UserDto;
  let mockFriend = FriendClass as FriendDto;

  let mockAuthService = {
    getUser: of(mockUser),
  }

  let mockPersonService = {
    personProfile: of({...mockUser, id: 'personID',
      request: [{...mockFriend, friends: {id: mockUser.id}}],
      suggest: [mockFriend],
      friends: [mockUser],
    }),
    addFriends: (friendID) => of({}),
    confirmFriends: (friendID) => of({}),
    deleteFriend: (personID) => of({}),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PersonService, useValue: mockPersonService },
      ],
      declarations: [ PersonComponent ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should add new suggest FriendDto[]', () => {
    let btn = fixture.debugElement.nativeElement.querySelector('ion-button#connect');
    component.person = {...mockUser, id: 'personID'};
    spyOn(mockPersonService, 'addFriends').and.returnValue(of({}));

    // btn.click();
    component.onFriends();
    expect(mockPersonService.addFriends).toHaveBeenCalledWith('personID');
    fixture.detectChanges();
  })

  it('should be confirmed request', () => {
    let btn = fixture.debugElement.nativeElement.querySelector('ion-button#confirm');
    spyOn(mockPersonService, 'confirmFriends').and.returnValue(of({}));

    btn.click();
    expect(mockPersonService.confirmFriends).toHaveBeenCalledWith( 'friendID');
    fixture.detectChanges();
  })

  it('should delete friend on id', () => {
    let btn = fixture.debugElement.nativeElement.querySelector('ion-button#del');
    spyOn(mockPersonService, 'deleteFriend').and.returnValue(of({}));

    btn.click();
    expect(mockPersonService.deleteFriend).toHaveBeenCalledWith('personID');
    fixture.detectChanges();
  })

});
