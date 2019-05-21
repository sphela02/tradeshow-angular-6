import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFieldPopupComponent } from './event-field-popup.component';

describe('EventFieldPopupComponent', () => {
  let component: EventFieldPopupComponent;
  let fixture: ComponentFixture<EventFieldPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventFieldPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFieldPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
