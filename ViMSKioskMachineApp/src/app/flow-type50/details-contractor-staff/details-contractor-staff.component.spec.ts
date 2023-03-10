import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsContractorStaffComponent } from './details-contractor-staff.component';

describe('DetailsContractorStaffComponent', () => {
  let component: DetailsContractorStaffComponent;
  let fixture: ComponentFixture<DetailsContractorStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsContractorStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsContractorStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
