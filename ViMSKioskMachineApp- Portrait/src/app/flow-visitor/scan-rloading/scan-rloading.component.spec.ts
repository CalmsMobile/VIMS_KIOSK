import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanRLoadingComponent } from './scan-rloading.component';

describe('ScanRLoadingComponent', () => {
  let component: ScanRLoadingComponent;
  let fixture: ComponentFixture<ScanRLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanRLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanRLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
