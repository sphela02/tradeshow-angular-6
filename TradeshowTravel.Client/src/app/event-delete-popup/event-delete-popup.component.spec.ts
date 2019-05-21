import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDeletePopupComponent } from './event-delete-popup.component';

describe('EventDeletePopupComponent', () => {
  let component: EventDeletePopupComponent;
  let fixture: ComponentFixture<EventDeletePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDeletePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
