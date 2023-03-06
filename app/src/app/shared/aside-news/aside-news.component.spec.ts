import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsideNewsComponent } from './aside-news.component';
import {UserInterface} from "../../core/interface/user.interface";
import {UserClass} from "../../../utils/user-class";
import {NewsInterface} from "../../core/interface/news.interface";
import {NewsClass} from "../../../utils/news-class";
import {NewsDto} from "../../core/dto/news.dto";

describe('AsideNewsComponent', () => {
  let component: AsideNewsComponent;
  let fixture: ComponentFixture<AsideNewsComponent>;

  let mockUser: UserInterface = UserClass as UserInterface;
  let mockNews: NewsInterface[] | NewsDto[] = [NewsClass] as NewsInterface[] | NewsDto[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideNewsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsideNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('', () => {
    let mockHTML = '<strong>Beware of the leopard</strong>';

    component.user = mockUser;
    component.tidings = mockNews;

    let getDOMContent = component.getDOMContent(mockHTML);
    expect(getDOMContent).toEqual('Beware of the leopard');
  })
});
