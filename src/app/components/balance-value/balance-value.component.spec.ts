import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceValueComponent } from './balance-value.component';

describe('BalanceValueComponent', () => {
  let component: BalanceValueComponent;
  let fixture: ComponentFixture<BalanceValueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BalanceValueComponent]
    });
    fixture = TestBed.createComponent(BalanceValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
