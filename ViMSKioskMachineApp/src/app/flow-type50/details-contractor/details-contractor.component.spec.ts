import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsContractorComponent } from './details-contractor.component';

describe('DetailsContractorComponent', () => {
  let component: DetailsContractorComponent;
  let fixture: ComponentFixture<DetailsContractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsContractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
