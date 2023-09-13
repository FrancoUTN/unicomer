import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedUserComponent } from './selected-user.component';

describe('SelectedUserComponent', () => {
  let component: SelectedUserComponent;
  let fixture: ComponentFixture<SelectedUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedUserComponent]
    });
    fixture = TestBed.createComponent(SelectedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
