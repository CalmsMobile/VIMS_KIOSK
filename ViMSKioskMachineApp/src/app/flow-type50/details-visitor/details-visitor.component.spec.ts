import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsVisitorComponent } from './details-visitor.component';

describe('DetailsVisitorComponent', () => {
  let component: DetailsVisitorComponent;
  let fixture: ComponentFixture<DetailsVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
