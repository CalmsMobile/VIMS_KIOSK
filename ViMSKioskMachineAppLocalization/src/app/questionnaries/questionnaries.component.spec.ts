import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnariesComponent } from './questionnaries.component';

describe('QuestionnariesComponent', () => {
  let component: QuestionnariesComponent;
  let fixture: ComponentFixture<QuestionnariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
