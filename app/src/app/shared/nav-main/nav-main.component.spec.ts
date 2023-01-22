import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import { NavMainComponent } from './nav-main.component';
import {AuthService} from "../../core/service/auth.service";
import {UserService} from "../../core/service/user.service";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {UserInterface} from "../../core/interface/user.interface";
import {PipeModule} from "../../core/pipe/pipe.module";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {routes} from "../../app-routing.module";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('NavMainComponent', () => {
  let component: NavMainComponent;
  let fixture: ComponentFixture<NavMainComponent>;
  let mockUser = UserClass as UserInterface;

  let mockAuthService = {
    userAvatar: of('avatar.png'),
  };
  let mockUserService = {
    getUser: of(mockUser),
  };
  let mockPopoverController = {
    create: (obj) => ({present: () => {}}),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: PopoverController, useValue: mockPopoverController }
      ],
      declarations: [ NavMainComponent ],
      imports: [
        RouterModule.forRoot(routes),
        RouterTestingModule,
        PipeModule,
        IonicModule.forRoot(),
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('open popup my setting', () => {
    let popup = fixture.debugElement.nativeElement.querySelector('ion-col#settings');
    spyOn(mockPopoverController, 'create').and.returnValue({present: () => {}});

    popup.click();
    expect(mockPopoverController.create).toHaveBeenCalled();
  })

  it('open popup add friend', () => {
    let popup = fixture.debugElement.nativeElement.querySelector('ion-router-link#friend');
    spyOn(mockPopoverController, 'create').and.returnValue({present: () => {}});

    popup.click();
    expect(mockPopoverController.create).toHaveBeenCalled();
  })
});
