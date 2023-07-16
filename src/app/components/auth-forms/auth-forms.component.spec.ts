import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormsComponent } from './auth-forms.component';

describe('AuthFormsComponent', () => {
  let component: AuthFormsComponent;
  let fixture: ComponentFixture<AuthFormsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthFormsComponent]
    });
    fixture = TestBed.createComponent(AuthFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
