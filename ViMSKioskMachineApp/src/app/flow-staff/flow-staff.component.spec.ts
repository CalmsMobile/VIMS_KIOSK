import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowStaffComponent } from './flow-staff.component';

describe('FlowStaffComponent', () => {
  let component: FlowStaffComponent;
  let fixture: ComponentFixture<FlowStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
