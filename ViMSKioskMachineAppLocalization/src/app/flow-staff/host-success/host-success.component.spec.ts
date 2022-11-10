import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSuccessComponent } from './host-success.component';

describe('HostSuccessComponent', () => {
  let component: HostSuccessComponent;
  let fixture: ComponentFixture<HostSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
