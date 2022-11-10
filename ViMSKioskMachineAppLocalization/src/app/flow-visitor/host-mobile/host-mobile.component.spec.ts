import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostMobileComponent } from './host-mobile.component';

describe('HostMobileComponent', () => {
  let component: HostMobileComponent;
  let fixture: ComponentFixture<HostMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
