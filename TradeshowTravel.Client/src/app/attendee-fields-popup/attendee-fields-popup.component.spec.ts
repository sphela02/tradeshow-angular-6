import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeFieldsPopupComponent } from './attendee-fields-popup.component';

describe('AttendeeFieldsPopupComponent', () => {
  let component: AttendeeFieldsPopupComponent;
  let fixture: ComponentFixture<AttendeeFieldsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeFieldsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeFieldsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
