import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FeetComponent} from './feet.component';
import {PostService} from "../../core/service/post.service";
import {RouterTestingModule} from "@angular/router/testing";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {PostClass} from "../../../utils/post-class";
import {PostInterface} from "../../core/interface/post.interface";

class MockPostService {
  get getPost() { return of({}) };
  get getPostsAll() { return of([]) };
}

describe('FeetComponent', () => {
  let component: FeetComponent;
  let fixture: ComponentFixture<FeetComponent>;
  let postService: PostService;

  let postClass = PostClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeetComponent ],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot()
      ],
      providers: [
        { provide: PostService, useClass: MockPostService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FeetComponent);
    postService = TestBed.inject(PostService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    let mockPostClass = postClass as PostInterface;
    let spyGetPost = spyOnProperty(postService, 'getPost', 'get').and.callFake(() => of(mockPostClass));
    let spyGetPostsAll = spyOnProperty(postService, 'getPostsAll', 'get').and.callFake(() => of([mockPostClass]));

    component.ngOnInit();

    expect(spyGetPost).toHaveBeenCalled();
    expect(spyGetPostsAll).toHaveBeenCalled();
    expect(component.post).toEqual(mockPostClass);
    expect(component.posts).toEqual([]);
  })

  it('ngOnDestroy', () => {
    component.postSub = of({}).subscribe();
    component.postsSub = of([]).subscribe();
    let spyPostSub = spyOn(component.postSub, 'unsubscribe');
    let spyPostsSub = spyOn(component.postsSub, 'unsubscribe');

    component.ngOnDestroy();

    expect(spyPostSub).toHaveBeenCalled();
    expect(spyPostsSub).toHaveBeenCalled();
  })

  it('getPost', () => {
    let mockPost = postClass as PostInterface;
    component.post = mockPost;
    fixture.detectChanges();

    expect(component.getPost).toEqual(mockPost);
  })
});
