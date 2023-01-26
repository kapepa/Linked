import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatePublicationComponent } from './create-publication.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { PostService } from "../../core/service/post.service";
import { AuthService } from "../../core/service/auth.service";
import { UserClass } from "../../../utils/user-class";
import { of } from "rxjs";
import {PostClass} from "../../../utils/post-class";
import {By} from "@angular/platform-browser";

describe('CreatePublicationComponent', () => {
  let component: CreatePublicationComponent;
  let fixture: ComponentFixture<CreatePublicationComponent>;
  let mockUser = UserClass;
  let mockPost = PostClass;


  let mockPostService = {
    createPost: (obj) => of(),
    updatePost: (index, edit, body) => of(),
  }

  let mockAuthService = {
    getUser: of(mockUser),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePublicationComponent ],
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePublicationComponent);
    component = fixture.componentInstance;
    component.onClosePublication = () => {};
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close popup edit or new', () => {
    let close = fixture.debugElement.nativeElement.querySelector('ion-button#close');
    spyOn(component, 'onClosePublication').and.returnValue();

    close.click();
    expect(component.onClosePublication).toHaveBeenCalled();
  })

  describe('ngOnInit create new post', () => {
    let mockBody = 'mockBody';
    beforeEach(waitForAsync(() => {
      component.post = undefined;
      component.index = null;
      component.postForm.get('body').setValue(mockBody);
    }));

    it('submit new post', () => {
      let form = fixture.debugElement.query(By.css('#form'));
      spyOn(mockPostService, 'createPost').and.returnValue(of({}));

      form.triggerEventHandler('submit', null);
      expect(mockPostService.createPost).toHaveBeenCalledWith({body: mockBody});
    })
  })

  describe('ngOnInit update post', () => {
    beforeEach(waitForAsync(() => {
      component.post = mockPost;
      component.index = 1;
      component.postForm.get('id').setValue(mockPost.id);
      component.postForm.get('body').setValue(mockPost.body);
      fixture.detectChanges();
    }))

    it('update post', () => {
      let form = fixture.debugElement.query(By.css('#form'));
      spyOn(mockPostService, 'updatePost').and.returnValue(of({}));

      form.triggerEventHandler('submit', null);
      expect(mockPostService.updatePost).toHaveBeenCalledWith(1, mockPost.id, {body: mockPost.body});
    })

    it('get edit id', () => {
      expect(component.edit).toEqual(mockPost.id);
    })
  })

  it('get body', () => {
    expect(component.body.value).toEqual('');
  })
});
