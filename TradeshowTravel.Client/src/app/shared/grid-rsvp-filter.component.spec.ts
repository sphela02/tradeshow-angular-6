import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridRsvpFilterComponent } from './grid-rsvp-filter.component';

describe('GridRsvpFilterComponent', () => {
  let component: GridRsvpFilterComponent;
  let fixture: ComponentFixture<GridRsvpFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridRsvpFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRsvpFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
