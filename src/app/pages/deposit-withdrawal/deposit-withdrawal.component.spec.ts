import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositWithdrawalComponent } from './deposit-withdrawal.component';

describe('DepositWithdrawalComponent', () => {
  let component: DepositWithdrawalComponent;
  let fixture: ComponentFixture<DepositWithdrawalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepositWithdrawalComponent]
    });
    fixture = TestBed.createComponent(DepositWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
