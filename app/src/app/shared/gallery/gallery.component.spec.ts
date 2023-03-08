import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {GalleryComponent} from './gallery.component';
import {SlickCarouselModule} from "ngx-slick-carousel";

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryComponent ],
      imports: [
        SlickCarouselModule,
        IonicModule.forRoot(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSlider', () => {
    let mockImg: string = 'fakeImg.jpg';
    component.images = [mockImg];

    expect(component.getSlider).toEqual([`${component.configUrl}/${mockImg}`]);
  })
});
