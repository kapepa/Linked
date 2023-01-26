import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import { NewPublicationsComponent } from './new-publications.component';
import {AuthService} from "../../core/service/auth.service";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {PipeModule} from "../../core/pipe/pipe.module";

describe('NewPublicationsComponent', () => {
  let component: NewPublicationsComponent;
  let fixture: ComponentFixture<NewPublicationsComponent>;
  let mockUser = UserClass;

  let mockAuthService = {
    userAvatar: of(mockUser),
  }
  let mockPopoverController = {
    create: () => ({ present: () => {} }),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PopoverController, useValue: mockPopoverController },
      ],
      declarations: [ NewPublicationsComponent ],
      imports: [
        PipeModule,
        IonicModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('create new post popup', () => {
    spyOn(mockPopoverController, 'create');
    let popup = fixture.debugElement.nativeElement.querySelector('ion-button.new-publications__btn');

    popup.click();
    expect(mockPopoverController.create).toHaveBeenCalled();
  })

});
