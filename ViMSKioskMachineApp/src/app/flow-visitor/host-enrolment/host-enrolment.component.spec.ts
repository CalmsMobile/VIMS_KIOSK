import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostEnrolmentComponent } from './host-enrolment.component';

describe('HostEnrolmentComponent', () => {
  let component: HostEnrolmentComponent;
  let fixture: ComponentFixture<HostEnrolmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostEnrolmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
