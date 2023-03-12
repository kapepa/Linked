import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {NewComponent} from './new.component';
import {NewsService} from "../../core/service/news.service";
import {NewsDto} from "../../core/dto/news.dto";
import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxEditorModule} from "ngx-editor";
import {Router, Routes} from "@angular/router";
import {NewCenterRoutingModule} from "./new-routing.module";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {NewsClass} from "../../../utils/news-class";
import {NewsInterface} from "../../core/interface/news.interface";

class MockNewsService {
  createNews(news: NewsDto) { return of({}) }
}

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let newsService: NewsService;
  let router: Router;

  let newsClass = NewsClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewComponent ],
      imports: [
        FormsModule,
        NgxEditorModule,
        ReactiveFormsModule,
        RouterTestingModule,
        IonicModule.forRoot(  ),
        NewCenterRoutingModule
      ],
      providers: [
        { provide: NewsService, useClass: MockNewsService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    newsService = TestBed.inject(NewsService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.ngOnInit();
    expect(component.editor).toBeTruthy();
  })

  it('onClickImg', () => {
    let spyOnClickImg = spyOn(component, 'onClickImg');
    let clickImg = fixture.debugElement.query(By.css('.loader-img'));

    clickImg.nativeNode.click()
    expect(spyOnClickImg).toHaveBeenCalled();
  })

  it('onCleaningImg', () => {
    let divClean = fixture.debugElement.query(By.css('.new__load-cleaning'));
    let mockFile = new File([""], "filename", { type: 'text/html' }) as any;
    component.form.get('img')?.patchValue(mockFile);

    divClean.nativeNode.click();
    expect(component.getImg.value).toBeNull();
  })

  it('onChangeFile', () => {
    let spyGetImg = spyOnProperty(component, 'getImg', 'get').and.returnValue({setValue: () => {}} as any)
    let inputFile = fixture.debugElement.query(By.css('.loader-img__input-file'));

    inputFile.triggerEventHandler('change',{ target: { files: { 0: {} } } });
    expect(spyGetImg).toHaveBeenCalled();
  })

  it('onSubmit', () => {
    let mockNews = newsClass as NewsDto;
    let mockTitle = mockNews.title;
    let mockContent = mockNews.content as any;
    component.form.get('title')?.patchValue(mockTitle);
    component.form.get('content')?.patchValue(mockContent);
    fixture.detectChanges();
    let spyCreateNews = spyOn(newsService, 'createNews').and.callFake((news: NewsDto) => of(newsClass as NewsInterface));
    let spyRouter = spyOn(router, 'navigate');
    let formSubmit = fixture.debugElement.query(By.css('.new__form'));

    formSubmit.triggerEventHandler('ngSubmit');
    expect(spyCreateNews).toHaveBeenCalledWith({title: mockTitle, content: '<p>news content</p>', img: null as any});
    expect(spyRouter).toHaveBeenCalledWith(['/news', mockNews.id])
  })

  it('doc', () => {
    let mockContent = 'fake content' as any;
    component.form.get('content')?.patchValue(mockContent) ;
    fixture.detectChanges();

    expect(component.doc.value).toEqual(`<p>${mockContent}</p>`);
  })

  it('getTitle', () => {
    let mockTitle = 'fake title';
    component.form.get('title')?.patchValue(mockTitle);
    fixture.detectChanges();

    expect(component.getTitle.value).toEqual(mockTitle);
  })

  it('getImg', () => {
    let mockFile = {} as any;
    component.form.get('img')?.patchValue(mockFile);
    fixture.detectChanges();

    expect(component.getImg.value).toEqual(mockFile);
  })
});
