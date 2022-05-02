import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetkioskcodeComponent } from './getkioskcode.component';

describe('GetkioskcodeComponent', () => {
  let component: GetkioskcodeComponent;
  let fixture: ComponentFixture<GetkioskcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetkioskcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetkioskcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
