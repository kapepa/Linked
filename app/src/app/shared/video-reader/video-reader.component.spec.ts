import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideoReaderComponent } from './video-reader.component';
import {By} from "@angular/platform-browser";

describe('VideoReaderComponent', () => {
  let component: VideoReaderComponent;
  let fixture: ComponentFixture<VideoReaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoReaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges', () => {
    let spyAudioSrc = spyOn(component, 'audioSrc');

    component.ngOnChanges({});
    expect(spyAudioSrc).toHaveBeenCalled();
  })

  it('ngAfterViewInit', () => {
    let spyAudioSrc = spyOn(component, 'audioSrc');

    component.ngAfterViewInit();
    expect(spyAudioSrc).toHaveBeenCalled();
  })

  describe('audioSrc', () => {
    it('should return url audio isn\'t File', () => {
      component.audio = 'fakeAudi';
      fixture.detectChanges();

      component.audioSrc();

      expect(component.videoPlayer?.nativeElement.src).toEqual(`${component.configUrl}/${component.audio}`);
    })

    it('should return string from File', () => {
      let fakeFile = new File(
        [new Blob(['1'.repeat(1024 * 1024 + 1)], { type: 'image/png' })],
        'darthvader.png'
      )
      let spyCreateObjectURL = spyOn(URL, 'createObjectURL');
      component.audio = fakeFile;
      fixture.detectChanges();

      component.audioSrc();

      expect(spyCreateObjectURL).toHaveBeenCalledWith(fakeFile);
    });
  })

  it('onClose', () => {
    component.clearAudio = () => {};
    let divClick = fixture.debugElement.query(By.css('.video-reader__close'));

    divClick.nativeNode.click();

    expect(component.clearAudio).toBeTruthy();
  })
});
