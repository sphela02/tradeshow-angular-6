import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegedUsersPopupComponent } from './privileged-users-popup.component';

describe('PrivilegedUsersPopupComponent', () => {
  let component: PrivilegedUsersPopupComponent;
  let fixture: ComponentFixture<PrivilegedUsersPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivilegedUsersPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegedUsersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
