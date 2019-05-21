import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFinderComponent } from './person-finder.component';

describe('PersonFinderComponent', () => {
  let component: PersonFinderComponent;
  let fixture: ComponentFixture<PersonFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
