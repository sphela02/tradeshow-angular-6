import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserProfile } from '../shared/UserProfile';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import { EventInfo } from '../shared/EventInfo';
import { TradeshowService } from '../tradeshow.service';
import { Permissions, Role, ShowType } from '../shared/Enums';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProfileEditPopupComponent } from '../profile-edit-popup/profile-edit-popup.component';
import { PageTitleService } from '../pagetitle.service';
import { SideMenuMode } from '../shared/shared';
import { Location } from '@angular/common';
import { ProfileImageUploadPopupComponent } from '../profile-image-upload-popup/profile-image-upload-popup.component';
import { UserPic } from '../shared/UserImage';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  @Output() profileChange = new EventEmitter<UserProfile>();
  @Output() avatarChange = new EventEmitter<UserPic>();
  private _event: EventInfo;
  private _profile: UserProfile;
  currentUser: UserProfile;
  HelperSvc: typeof CommonService = CommonService;
  showEditLink: boolean = false;
  showProfilePic: boolean = false;
  showPassportInfo: boolean = false;
  completionText: string;
  userPicInfo: UserPic;

  constructor(
    private service: TradeshowService,
    private modal: NgbModal,
    private pagetitle: PageTitleService,
    private location: Location
  ) {
    let url: string = this.location.normalize(environment.imgLibraryURL);
    if (url.indexOf("http") == -1) {
      url = this.location.prepareExternalUrl(url);
    } 
    this.userPicInfo = {} as UserPic;
    this.userPicInfo.BaseURL = url;
  }

  ngOnInit() {
    this.service.getMyProfile().subscribe(user => {
      this.currentUser = user;
      this.onInputsChanged();
    });
  }

  @Input()
  set profile(profile: UserProfile) {
    this._profile = profile;
    this.onInputsChanged();
  }
  get profile(): UserProfile {
    return this._profile;
  }
  

  @Input()
  set event(event: EventInfo) {
    this._event = event;
    this.onInputsChanged();
  }
  get event(): EventInfo {
    return this._event;
  }

  private onInputsChanged() {
    if (this.profile) {
      this.showProfilePic = this.profile.ShowPicture &&
        (this.profile.EmplID && this.profile.EmplID.length > 0);
    }

    // show edit link and passport info?
    this.showEditLink = this.HelperSvc.canEditProfile(
      this.currentUser, this.profile, this.event, Role.Lead | Role.Support
    );
    this.showPassportInfo = this.HelperSvc.canViewPassportInfo(
      this.currentUser, this.profile, this.event
    );

    // figure out pic username 
    if (this.profile){
      this.userPicInfo.Username = this.profile.Username;
    }
    else {
      this.userPicInfo.Username = this.currentUser.Username;
    }
   
    // get pic out of db - cannot set url to file first else will throw error and showprofilepic is false
    this.service.getAvatar(this.userPicInfo.Username)
    .subscribe(result => {
      this.createImageFromBlob(result); 
      if (!result) {
        this.userPicInfo.PicURL = this.userPicInfo.BaseURL + '/' + this.profile.EmplID + ".jpg" 
      }
    }, error => {
      console.log("Getting avatar error", JSON.stringify(error));
    })

    if (this.event && this.profile) {
      this.completionText = "COMPLETE";
      if (!this.profile.FirstName ||
          !this.profile.LastName ||
          !this.profile.Segment ||
          !this.profile.Email ||
          !this.profile.Telephone ||
          !this.profile.Mobile ||
          !this.profile.BadgeName) {
          this.completionText = "INCOMPLETE";
        }
      else if (this.event.ShowType == ShowType.International) {
        if (!this.profile.PassportName ||
            !this.profile.PassportNumber ||
            !this.profile.Nationality ||
            !this.profile.DOB ||
            !this.profile.COB ||
            !this.profile.COR ||
            !this.profile.COI) {
            this.completionText = "INCOMPLETE";
          }
      }
    } else {
      this.completionText = null;
    }
  }

  imgErrHandler(event) {
    // error on img load 
    if (this.userPicInfo.PicURL && this.userPicInfo.PicURL.length > 0) {
      this.showProfilePic = false;
    }
  }

  downloadPhoto() {
    let filename: string = this.profile.Username + ".jpg";
    this.service.getPhoto(this.userPicInfo.PicURL)
      .subscribe(photo => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(photo, filename);
        } else {
          var url = window.URL.createObjectURL(photo);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        }
      }, error => {
        console.log("download error:", JSON.stringify(error));
      });
  }

  popupEditProfile() {
    const modalOptions: NgbModalOptions = {
      size: "lg",
      backdrop: "static"
    };

    // popupEdit uses picinfo so going to save off and rest 
    const popupModalRef = this.modal.open(ProfileEditPopupComponent, modalOptions);
    popupModalRef.componentInstance.event = this.event;
    popupModalRef.componentInstance.profile = this.profile;
    popupModalRef.componentInstance.saveClicked.subscribe(profile => {
      this.profile = profile;
      this.userPicInfo.Username = this.profile.Username;
      //this.avatarChange.emit(this.userPicInfo);
      this.profileChange.emit(profile);
      popupModalRef.close();
    });
  }

  popupPicUpload() { 
    this.userPicInfo.Category = "Avatar";
    this.userPicInfo.ShowPicture = this.showProfilePic;
    this.userPicInfo.CanEdit = this.showEditLink;
    this.userPicInfo.ShowPassport = this.showPassportInfo;
    
    const popupModalRef2 = this.modal.open(ProfileImageUploadPopupComponent) 
    popupModalRef2.componentInstance.userPic = this.userPicInfo;
    popupModalRef2.componentInstance.saveClicked.subscribe(userPic => {
      this.userPicInfo = userPic;
      this.userPicInfo.Username = this.profile.Username;
      this.avatarChange.emit(this.userPicInfo);
      popupModalRef2.close();
    });
  }
    
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        this.userPicInfo.PicURL = reader.result;
    }, false);
    if (image) {
        reader.readAsDataURL(image);
    }  
  }
}