import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TapePostComponent } from './tape-post.component';
import {PostService} from "../../core/service/post.service";
import {AuthService} from "../../core/service/auth.service";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {PostClass} from "../../../utils/post-class";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";

describe('TapePostComponent', () => {
  let component: TapePostComponent;
  let fixture: ComponentFixture<TapePostComponent>;
  let mockUser = UserClass;
  let mockPost = PostClass;

  let mockPostService = {
    postLength: of([mockPost].length),
    getPosts: (query) => of({}),
  };
  let mockAuthService = {
    userID: of(mockUser.id),
    userAvatar: of(mockUser.avatar),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      declarations: [ TapePostComponent ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TapePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get post take and post PostDto[]', () => {
    let cb = () => {};
    let query = { take: 5, skip: 0 };
    spyOn(mockPostService, 'getPosts').and.returnValue(of({}));

    component.getPost(query, cb);
    expect(mockPostService.getPosts).toHaveBeenCalledWith(query);
  })

  it('load post PostDto[]', () => {
    spyOn(component, 'getPost');
    let scroll = fixture.debugElement.query(By.css('ion-infinite-scroll'));

    scroll.triggerEventHandler('ionInfinite');
    expect(component.getPost).toHaveBeenCalled();
  })

});
