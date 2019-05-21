import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSegFilterComponent } from './grid-seg-filter.component';

describe('GridSegFilterComponent', () => {
  let component: GridSegFilterComponent;
  let fixture: ComponentFixture<GridSegFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSegFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSegFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
