import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRsvpPopupComponent } from './send-rsvp-popup.component';

describe('SendRsvpPopupComponent', () => {
  let component: SendRsvpPopupComponent;
  let fixture: ComponentFixture<SendRsvpPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendRsvpPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendRsvpPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
