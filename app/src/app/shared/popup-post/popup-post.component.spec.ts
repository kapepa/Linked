import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupPostComponent } from './popup-post.component';
import {By} from "@angular/platform-browser";
import {GalleryModule} from "../gallery/gallery.module";
import {UserClass} from "../../../utils/user-class";
import {PostClass} from "../../../utils/post-class";
import {PostInterface} from "../../core/interface/post.interface";

describe('PopupPostComponent', () => {
  let component: PopupPostComponent;
  let fixture: ComponentFixture<PopupPostComponent>;

  let userClass = UserClass;
  let postClass = PostClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PopupPostComponent,
      ],
      imports: [
        GalleryModule,
        IonicModule.forRoot(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onClose', () => {
    let mockOnClose = spyOn(component, 'onClose');
    let divClose = fixture.debugElement.query(By.css('.popup-post__close'));

    divClose.nativeElement.click();

    expect(mockOnClose).toHaveBeenCalled();
  })

  it('getAuthorAvatar', () => {
    let mockUser = userClass;
    let mockPost = postClass;

    component.post = mockPost as PostInterface;
    expect(component.getAuthorAvatar).toEqual(mockUser.avatar);
  })

});
