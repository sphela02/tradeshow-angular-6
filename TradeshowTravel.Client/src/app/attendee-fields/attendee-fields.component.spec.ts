import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeFieldsComponent } from './attendee-fields.component';

describe('AttendeeFieldsComponent', () => {
  let component: AttendeeFieldsComponent;
  let fixture: ComponentFixture<AttendeeFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
