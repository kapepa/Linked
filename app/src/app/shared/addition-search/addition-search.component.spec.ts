import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdditionSearchComponent } from './addition-search.component';
import {PostService} from "../../core/service/post.service";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdditionClass} from "../../../utils/addition-class";
import {of} from "rxjs";
import {AdditionDto} from "../../core/dto/addition.dto";
import {ActivatedRoute, Router} from "@angular/router";

class MockPostService {
  indexEdit(index: number) {};
  get getCreateAddition () { return of(undefined) };
  get getEditAddition () { return of(undefined) };
  set setEditAddition (addition: AdditionDto) {};
  set setCreateAddition (addition: AdditionDto) {};
}

describe('AdditionSearchComponent', () => {
  let component: AdditionSearchComponent;
  let fixture: ComponentFixture<AdditionSearchComponent>;
  let postService: PostService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  let additionClass = AdditionClass;

  let activatedRouteSpy = {
    ...jasmine.createSpyObj("ActivatedRoute", ["snapshot"]),
    snapshot: {queryParams: {  }}
  };

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
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
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
        let mockQuery: { index: number } = { index: 1 };
        let navigateSpy = spyOn(router, 'navigate');

        spyOn(postService, 'indexEdit').and.returnValue(of(false));
        activatedRoute.snapshot.queryParams = mockQuery;

        component.ngOnInit();
        expect(postService.indexEdit).toHaveBeenCalledWith(mockQuery.index);
        expect(navigateSpy).toHaveBeenCalledWith([''], { queryParams: {} } );
      })
    })
  })

  describe('ngOnDestroy', () => {
    let mockAddition: AdditionDto;
    let mockCreate: jasmine.Spy;

    beforeEach(() => {
      mockAddition = additionClass as AdditionDto;
      mockCreate = spyOn(component, 'createAddition');

      mockCreate.and.returnValue(mockAddition);
    })

    it('type === create', () => {
      component.type = 'create';
      let mockSetCreate = spyOnProperty(postService, 'setCreateAddition', 'set');

      component.ngOnDestroy();

      expect(mockCreate).toHaveBeenCalled();
      expect(mockSetCreate).toHaveBeenCalledWith(mockAddition);
    })

    it('type === edit', () => {
      component.type = 'edit';
      let mockSetEdit = spyOnProperty(postService, 'setEditAddition', 'set');

      component.ngOnDestroy();

      expect(mockCreate).toHaveBeenCalled();
      expect(mockSetEdit).toHaveBeenCalledWith(mockAddition);
    })
  })

  it('onClose', () => {
    // need realize
  })

  describe('createForm', () => {
    let mockAddition: AdditionDto;

    beforeEach(() => {
      let { post, ...other } = AdditionClass
      mockAddition = other as AdditionDto;
      component.createForm(mockAddition);
    })

    it('createAddition', () => {
      expect(component.createAddition()).toEqual(mockAddition);
    })

    it("get getJob", () => {
      expect(component.getJob?.value).toEqual(mockAddition.jobTitle);
    })

    it("get getCompany", () => {
      expect(component.getCompany?.value).toEqual(mockAddition.company);
    })

    it('getPlace', () => {
      expect(component.getPlace?.value).toEqual(mockAddition.placesWork);
    })

    it('getRegion', () => {
      expect(component.getRegion?.value).toEqual(mockAddition.region);
    })

    it('getID', () => {
      expect(component.getID?.value).toEqual(mockAddition.id);
    })

  })

  describe('get query. getQuery', () => {
    it('type === create', () => {
      component.type = 'create';
      expect(component.getQuery).toEqual({ create: true });
    })

    it('type === edit', () => {
      let mockIndex: number = 1;
      let mockQuery: string = 'fakeQuery';

      component.index = mockIndex;
      component.query = mockQuery;

      expect(component.getQuery).toEqual({ edit: mockQuery, index: mockIndex })
    })
  })
});
