import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanqrcodeComponent } from './scanqrcode.component';

describe('ScanqrcodeComponent', () => {
  let component: ScanqrcodeComponent;
  let fixture: ComponentFixture<ScanqrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanqrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanqrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
