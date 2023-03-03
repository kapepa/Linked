import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdditionSearchComponent } from './addition-search.component';
import {PostService} from "../../core/service/post.service";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdditionClass} from "../../../utils/addition-class";
import {of} from "rxjs";
import {AdditionDto} from "../../core/dto/addition.dto";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";

class MockPostService {
  indexEdit(index: number) {};
  get getCreateAddition () { return of(undefined) };
  get getEditAddition () { return of(undefined) };
}

describe('AdditionSearchComponent', () => {
  let component: AdditionSearchComponent;
  let fixture: ComponentFixture<AdditionSearchComponent>;
  let postService: PostService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  let additionClass = AdditionClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdditionSearchComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: PostService, useClass: MockPostService },
        {
          provide: ActivatedRoute,
          useValue: { ...jasmine.createSpyObj("ActivatedRoute", [""]), snapshot: { queryParams: {index: 1} } }  ,
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    postService = TestBed.inject(PostService);
    fixture = TestBed.createComponent(AdditionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let additionMock: AdditionDto;
    let createFormSpy: jasmine.Spy;

    beforeEach(() => {
      createFormSpy = spyOn(component, 'createForm');
      additionMock = additionClass as AdditionDto;
    })

    it('type === create', () => {
      component.type = 'create';
      spyOnProperty(postService, "getCreateAddition", "get").and.returnValue(of(additionMock));

      component.ngOnInit();
      expect(createFormSpy).toHaveBeenCalledWith(additionMock);
    })

    describe('type === edit', () => {
      beforeEach(() => {
        component.type = 'edit';
      })

      it('addition is true',() => {
        spyOnProperty(postService, "getEditAddition", "get").and.returnValue(of(additionMock));
        component.ngOnInit();
        expect(createFormSpy).toHaveBeenCalledWith(additionMock);
      })

      it('select on query params', () => {
        spyOn(postService, 'indexEdit').and.returnValue(of(true));

        component.ngOnInit();
        expect(postService.indexEdit).toHaveBeenCalledWith(1);
      })
    })
  })
});
