import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocReaderComponent } from './doc-reader.component';
import {By} from "@angular/platform-browser";

describe('DocReaderComponent', () => {
  let component: DocReaderComponent;
  let fixture: ComponentFixture<DocReaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocReaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('docSrc', () => {
    it('when file is File', () => {
      let mockFileReader = spyOn(component.reader, 'readAsDataURL').and.callFake(() => {});
      let mockFile = { name: 'fakeName' } as File;

      component.file = mockFile;
      component.docSrc();

      expect(mockFileReader).toHaveBeenCalledWith(mockFile);
    })

    it('when file is string', () => {
      component.file = 'fakeFile';
      component.docSrc();

      expect(component.fileText).toEqual(`${component.configUrl}/${component.file}`);
    })
  })

  it('onClose', () => {
    component.clearFile = () => {};
    let divClose = fixture.debugElement.query(By.css('.doc-reader__close'));

    divClose.nativeElement.click();

    expect(component.clearFile).toBeTruthy();
  })
});
