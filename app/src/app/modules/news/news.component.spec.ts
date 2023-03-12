import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {NewsComponent} from './news.component';
import {NewsService} from "../../core/service/news.service";
import {UserService} from "../../core/service/user.service";
import {UserClass} from "../../../utils/user-class";
import {NewsClass} from "../../../utils/news-class";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {UserInterface} from "../../core/interface/user.interface";
import {NewsInterface} from "../../core/interface/news.interface";

class MockNewsService {
  get getNews() { return of({}) };
  get getTidings() { return of([]) };
}

class MockUserService {
  get getUser() { return of({}) };
}

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let newsService: NewsService;
  let userService: UserService;

  let newsClass = NewsClass;
  let userClass = UserClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NewsService, useClass: MockNewsService },
        { provide: UserService, useClass: MockUserService },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsComponent);
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
    let mockNews = newsClass as NewsInterface;
    let spyGetUser = spyOnProperty(userService, 'getUser', 'get').and.callFake(() => of(mockUser));
    let spyGetNews = spyOnProperty(newsService, 'getNews', 'get').and.callFake(() => of(mockNews));
    let spyGetTidings = spyOnProperty(newsService, 'getTidings', 'get').and.callFake(() => of([mockNews]));

    component.ngOnInit();

    expect(spyGetUser).toHaveBeenCalled();
    expect(spyGetNews).toHaveBeenCalled();
    expect(spyGetTidings).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
    expect(component.news).toEqual(mockNews);
    expect(component.tidings).toEqual([mockNews]);
  })

  it('ngOnDestroy', () => {
    component.userSub = of({}).subscribe();
    component.newsSub = of({}).subscribe();
    component.tidingsSub = of([]).subscribe();
    let spyUserSub = spyOn(component.userSub, 'unsubscribe');
    let spyNewsSub = spyOn(component.newsSub, 'unsubscribe');
    let spyTidingsSub = spyOn(component.tidingsSub, 'unsubscribe');

    component.ngOnDestroy();

    expect(spyUserSub).toHaveBeenCalled();
    expect(spyNewsSub).toHaveBeenCalled();
    expect(spyTidingsSub).toHaveBeenCalled();
  })

  it('getTidings', () => {
    let mockNews = newsClass as NewsInterface;
    component.tidings = [mockNews] as NewsInterface[];
    component.news = mockNews;

    fixture.detectChanges();
    expect(component.getTidings).toEqual([]);
  })
});
