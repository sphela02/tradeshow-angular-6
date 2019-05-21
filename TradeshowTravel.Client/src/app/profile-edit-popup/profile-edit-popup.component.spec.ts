import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditPopupComponent } from './profile-edit-popup.component';

describe('ProfileEditPopupComponent', () => {
  let component: ProfileEditPopupComponent;
  let fixture: ComponentFixture<ProfileEditPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEditPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
