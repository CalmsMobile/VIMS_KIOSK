import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowVisitorComponent } from './flow-visitor.component';

describe('FlowVisitorComponent', () => {
  let component: FlowVisitorComponent;
  let fixture: ComponentFixture<FlowVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
