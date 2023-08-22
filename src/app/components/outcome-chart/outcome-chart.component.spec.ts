import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomeChartComponent } from './outcome-chart.component';

describe('OutcomeChartComponent', () => {
  let component: OutcomeChartComponent;
  let fixture: ComponentFixture<OutcomeChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutcomeChartComponent]
    });
    fixture = TestBed.createComponent(OutcomeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
