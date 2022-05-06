import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHostComponent } from './search-host.component';

describe('SearchHostComponent', () => {
  let component: SearchHostComponent;
  let fixture: ComponentFixture<SearchHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
