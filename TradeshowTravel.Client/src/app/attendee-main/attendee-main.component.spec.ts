import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeMainComponent } from './attendee-main.component';

describe('AttendeeMainComponent', () => {
  let component: AttendeeMainComponent;
  let fixture: ComponentFixture<AttendeeMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
