import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainNewsComponent } from './main-news.component';
import {NewsClass} from "../../../utils/news-class";
import {NewsInterface} from "../../core/interface/news.interface";

describe('MainNewsComponent', () => {
  let component: MainNewsComponent;
  let fixture: ComponentFixture<MainNewsComponent>;

  let newsClass = NewsClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainNewsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("getDOMContent", () => {
    component.news = newsClass as NewsInterface;
    fixture.detectChanges();

    expect(component.getDOMContent).toEqual(newsClass.content as string);
  })
});
