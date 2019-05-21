import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeInfoComponent } from './attendee-info.component';

describe('AttendeeInfoComponent', () => {
  let component: AttendeeInfoComponent;
  let fixture: ComponentFixture<AttendeeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
