import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorCheckoutComponent } from './visitor-checkout.component';

describe('VisitorPreApontmntComponent', () => {
  let component: VisitorCheckoutComponent;
  let fixture: ComponentFixture<VisitorCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
