import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerOrErrorComponent } from './spinner-or-error.component';

describe('SpinnerOrErrorComponent', () => {
  let component: SpinnerOrErrorComponent;
  let fixture: ComponentFixture<SpinnerOrErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerOrErrorComponent]
    });
    fixture = TestBed.createComponent(SpinnerOrErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
