import { ImgDirective } from './img.directive';
import {ComponentFixture, TestBed, } from "@angular/core/testing";
import {Component, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";

@Component({
  template:
    `<div>
      <img appImg src="images.png">
    </div>`
})
class TestComponent { };

describe('ImgDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ ImgDirective, TestComponent ]
    })
      .createComponent(TestComponent);

    fixture.detectChanges();
    des = fixture.debugElement.queryAll(By.directive(ImgDirective));
  });

  it('should create an instance', () => {
    let img = (des[0].nativeElement as HTMLImageElement);

    expect(img.src).toEqual(`${environment.configUrl}/images.png`);
  });
});
