import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import { PostComponent } from './post.component';
import { PostService } from "../../core/service/post.service";
import { of } from "rxjs";
import { UserClass } from "../../../utils/user-class";
import { PostClass } from "../../../utils/post-class";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let mockPost = PostClass;
  let mockUser = {...UserClass, feet: mockPost};

  let mockPostService = {
    deletePost: (index, postID) => of(),
  };
  let mockPopoverController = {
    create: () => ({ present: () => {} }),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: PopoverController, useValue: mockPopoverController },
      ],
      declarations: [ PostComponent ],
      imports: [ IonicModule.forRoot() ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    component.index = 0;
    component.userID = mockUser.id;
    component.post = mockPost;
    component.userAvatar = '';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('open edit popup', () => {
    spyOn(mockPopoverController, 'create').and.returnValue({ present: () => {} });
    let btn = fixture.debugElement.nativeElement.querySelector('ion-button#edit');

    btn.click();
    expect(mockPopoverController.create).toHaveBeenCalled();
  })

  it('', () => {
    spyOn(mockPostService, 'deletePost').and.returnValue(of((index, postID) => of()));
    let btn = fixture.debugElement.nativeElement.querySelector('ion-button#del');

    btn.click();
    expect(mockPostService.deletePost).toHaveBeenCalledWith(component.index, component.post.id);
  })

  it('', () => {
    expect(component.avatar).toEqual('');
  })
});
