import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostotpComponent } from './hostotp.component';

describe('HostotpComponent', () => {
  let component: HostotpComponent;
  let fixture: ComponentFixture<HostotpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostotpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
