import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeDeletePopupComponent } from './attendee-delete-popup.component';

describe('AttendeeDeletePopupComponent', () => {
  let component: AttendeeDeletePopupComponent;
  let fixture: ComponentFixture<AttendeeDeletePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeDeletePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
