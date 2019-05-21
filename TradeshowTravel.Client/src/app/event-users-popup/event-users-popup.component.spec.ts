import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventUsersPopupComponent } from './event-users-popup.component';

describe('EventUsersPopupComponent', () => {
  let component: EventUsersPopupComponent;
  let fixture: ComponentFixture<EventUsersPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventUsersPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventUsersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
