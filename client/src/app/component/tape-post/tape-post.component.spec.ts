import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapePostComponent } from './tape-post.component';

describe('TapePostComponent', () => {
  let component: TapePostComponent;
  let fixture: ComponentFixture<TapePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TapePostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TapePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
