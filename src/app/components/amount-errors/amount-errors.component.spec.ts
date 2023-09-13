import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountErrorsComponent } from './amount-errors.component';

describe('AmountErrorsComponent', () => {
  let component: AmountErrorsComponent;
  let fixture: ComponentFixture<AmountErrorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmountErrorsComponent]
    });
    fixture = TestBed.createComponent(AmountErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
