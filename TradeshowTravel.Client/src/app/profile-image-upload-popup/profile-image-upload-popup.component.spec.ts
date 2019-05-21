import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageUploadPopupComponent } from './profile-image-upload-popup.component';

describe('ProfileImageUploadPopupComponent', () => {
  let component: ProfileImageUploadPopupComponent;
  let fixture: ComponentFixture<ProfileImageUploadPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImageUploadPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImageUploadPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
