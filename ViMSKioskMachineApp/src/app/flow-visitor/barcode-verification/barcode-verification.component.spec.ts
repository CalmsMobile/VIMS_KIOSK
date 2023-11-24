import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeVerificationComponent } from './barcode-verification.component';

describe('BarcodeVerificationComponent', () => {
  let component: BarcodeVerificationComponent;
  let fixture: ComponentFixture<BarcodeVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
