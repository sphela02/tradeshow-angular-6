import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeRsvpPopupComponent } from './attendee-rsvp-popup.component';

describe('AttendeeRsvpPopupComponent', () => {
  let component: AttendeeRsvpPopupComponent;
  let fixture: ComponentFixture<AttendeeRsvpPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeRsvpPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeRsvpPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
