import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSummaryComponent } from './visitor-summary.component';

describe('VisitorSummaryComponent', () => {
  let component: VisitorSummaryComponent;
  let fixture: ComponentFixture<VisitorSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
