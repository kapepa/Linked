import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {FileReaderComponent} from './file-reader.component';
import {By} from "@angular/platform-browser";
import {SimpleChanges} from "@angular/core";
import {of} from "rxjs";

describe('FileReaderComponent', () => {
  let component: FileReaderComponent;
  let fixture: ComponentFixture<FileReaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileReaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FileReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onDeleteImg', () => {
    component.imgList = ['fakeImages.png'];
    fixture.detectChanges();

    let spyDeleteImg = spyOn(component, 'onDeleteImg');
    let divDelete = fixture.debugElement.query(By.css('.file-reader__card'));
    divDelete.nativeElement.click();

    expect(spyDeleteImg).toHaveBeenCalledWith(0);
  })

  it('ngOnChanges', () => {
    let spyImgSrc = spyOn(component, 'imgSrc');
    component.ngOnChanges({} as SimpleChanges);

    expect(spyImgSrc).toHaveBeenCalled();
  })

  describe('imgSrc', () => {
    let spyReadDataURL: jasmine.Spy;

    beforeEach(() => {
      spyReadDataURL = spyOn(component, 'readDataURL').and.callFake((img: any) => { return Promise.resolve(img.name) });
    })

    it('when img is array', () => {
      component.img = [{ name: 'fakeNameImg.png' } as File];
      fixture.detectChanges();
      component.imgSrc();

      expect(spyReadDataURL).toHaveBeenCalled();
    })

    it('when img is File', () => {
      component.img = { name: 'fakeNameImg.png' } as File;
      fixture.detectChanges();
      component.imgSrc();

      expect(spyReadDataURL).toHaveBeenCalled();
    })

    it('when img is string', () => {
      component.img = 'fakeNameImg.png';
      fixture.detectChanges();
      component.imgSrc();

      expect(`${component.configUrl}/${component.img}`).toEqual(component.imgText);
    })
  })

  it('readDataURL', () => {
    let mockFile = new File(
      [new Blob(['1'.repeat(1024 * 1024 + 1)], { type: 'image/png' })],
      'darthvader.png'
    )

    component.readDataURL(mockFile).then((imgURL: string) => {
      expect(imgURL).toBeTruthy();
    })
  })
});
