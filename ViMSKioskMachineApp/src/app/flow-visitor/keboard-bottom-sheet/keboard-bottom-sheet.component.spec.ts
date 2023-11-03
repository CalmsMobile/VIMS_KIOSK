import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeboardBottomSheetComponent } from './keboard-bottom-sheet.component';

describe('KeboardBottomSheetComponent', () => {
  let component: KeboardBottomSheetComponent;
  let fixture: ComponentFixture<KeboardBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeboardBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeboardBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
