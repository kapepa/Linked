import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {HomeComponent} from './home.component';
import {RouterTestingModule} from "@angular/router/testing";
import {NewsService} from "../../core/service/news.service";
import {UserService} from "../../core/service/user.service";
import {of} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {UserClass} from "../../../utils/user-class";
import {UserInterface} from "../../core/interface/user.interface";
import {NewsClass} from "../../../utils/news-class";
import {NewsInterface} from "../../core/interface/news.interface";

class MockNewsService {
  get getTidings() { return of([]) }
}

class MockUserService {
  get getUser() { return of({}) }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let newsService: NewsService;
  let userService: UserService;

  let userClass = UserClass;
  let newsClass = NewsClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot()
      ],
      providers: [
        { provide: NewsService, useClass: MockNewsService },
        { provide: UserService, useClass: MockUserService },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    newsService = TestBed.inject(NewsService);
    userService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    let mockUser = userClass as UserInterface;
    let mockNewsClass = newsClass as NewsInterface;
    let spyGetUser = spyOnProperty(userService, 'getUser', 'get').and.callFake(() => of(mockUser));
    let spyGetTidings = spyOnProperty(newsService, 'getTidings', 'get').and.callFake(() => of([mockNewsClass]));

    component.ngOnInit();

    expect(spyGetUser).toHaveBeenCalled();
    expect(spyGetTidings).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
    expect(component.tidings).toEqual([mockNewsClass]);
  })

  it('ngOnDestroy', () => {
    component.userSub = of({}).subscribe();
    component.tidingsSub = of([]).subscribe();
    let spyUserSub = spyOn(component.userSub, 'unsubscribe');
    let spyTidingsSub = spyOn(component.tidingsSub, 'unsubscribe');

    component.ngOnDestroy();
    expect(spyUserSub).toHaveBeenCalled();
    expect(spyTidingsSub).toHaveBeenCalled();
  })
});
