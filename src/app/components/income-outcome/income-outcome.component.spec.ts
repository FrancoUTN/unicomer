import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeOutcomeComponent } from './income-outcome.component';

describe('IncomeOutcomeComponent', () => {
  let component: IncomeOutcomeComponent;
  let fixture: ComponentFixture<IncomeOutcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeOutcomeComponent]
    });
    fixture = TestBed.createComponent(IncomeOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
