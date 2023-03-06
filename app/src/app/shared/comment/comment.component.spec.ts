import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {CommentComponent} from './comment.component';
import {PostService} from "../../core/service/post.service";
import {UserService} from "../../core/service/user.service";
import {UserClass} from "../../../utils/user-class";
import {CommentClass, PostClass} from "../../../utils/post-class";
import {Observable, of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PostInterface} from "../../core/interface/post.interface";
import {UserInterface} from "../../core/interface/user.interface";
import {CommentInterface} from "../../core/interface/comment.interface";
import {By} from "@angular/platform-browser";

class MockUserService {
  get getUser(): Observable<UserInterface> { return of({} as UserInterface) };
}

class MockPostService {
  get getPost(): Observable<PostInterface> { return of({} as PostInterface) };
  get getComments(): Observable<CommentInterface[]> { return of([] as CommentInterface[]) };
  createComment( postID: string, body: { comment: string } ) {};
  deleteComment( index: number, commentID: string ) {};
  receiveComment( query: {skip: number, take: number} ) {}
}

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let postService: PostService;
  let userService: UserService;

  let userClass = UserClass;
  let postClass = PostClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: PostService, useClass: MockPostService },
        { provide: UserService, userClass: MockUserService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentComponent);
    userService = TestBed.inject(UserService);
    postService = TestBed.inject(PostService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOnProperty(userService, "getUser", "get").and.returnValue(of(userClass as UserInterface));
      spyOnProperty(postService, "getPost", 'get').and.returnValue(of(postClass as PostInterface));
      spyOnProperty(postService, "getComments", 'get').and.returnValue(of(postClass.comments as CommentInterface[]));

      component.ngOnInit();
      fixture.detectChanges()
    })

    it('should return new user and comments', () => {
      expect(component.user).toEqual(userClass as UserInterface);
      expect(component.comments).toEqual(postClass.comments as CommentInterface[]);
    })

    it('should return all comments', () => {
      expect(component.getComment?.value).toEqual(postClass.comments);
    })

    it('should received list comment id', () => {
      expect(component.getPostID?.value).toEqual(postClass.id);
    })
  })

  it('ngOnDestroy', () => {
    component.userSub = of({}).subscribe();
    component.postSub = of({}).subscribe();
    component.commentsSub = of({}).subscribe();

    let spyUserSub = spyOn(component.userSub, 'unsubscribe');
    let spyPostSub = spyOn(component.postSub, 'unsubscribe');
    let spyCommentsSub = spyOn(component.commentsSub, 'unsubscribe');

    component.ngOnDestroy();

    expect(spyUserSub).toHaveBeenCalled();
    expect(spyPostSub).toHaveBeenCalled();
    expect(spyCommentsSub).toHaveBeenCalled();
  })

  it('onSubmit', () => {
    let spyReceiveComment = spyOn(postService, 'receiveComment').and.returnValue(of([]));
    let form = fixture.debugElement.query(By.css('.comment__form'));

    component.commentForm.get('comment')?.patchValue(postClass.comments)
    form.triggerEventHandler('submit', {});

    // expect(spyReceiveComment).toHaveBeenCalled(  );
    // console.log( (postClass.comments as CommentInterface[])[0] )
  })

});
