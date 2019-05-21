import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendeePopupComponent } from './add-attendee-popup.component';

describe('AddAttendeePopupComponent', () => {
  let component: AddAttendeePopupComponent;
  let fixture: ComponentFixture<AddAttendeePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttendeePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
