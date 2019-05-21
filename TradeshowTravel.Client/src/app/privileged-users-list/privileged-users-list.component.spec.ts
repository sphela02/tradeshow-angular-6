import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegedUsersInfoComponent } from './privileged-users-list.component';

describe('PrivilegedUsersInfoComponent', () => {
  let component: PrivilegedUsersInfoComponent;
  let fixture: ComponentFixture<PrivilegedUsersInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivilegedUsersInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegedUsersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
