import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorPreApontmntComponent } from './visitor-pre-apontmnt.component';

describe('VisitorPreApontmntComponent', () => {
  let component: VisitorPreApontmntComponent;
  let fixture: ComponentFixture<VisitorPreApontmntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorPreApontmntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorPreApontmntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
