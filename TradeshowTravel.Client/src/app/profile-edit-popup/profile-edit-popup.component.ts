import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserProfile } from '../shared/UserProfile';
import { NgbModal, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';
import { TradeshowService } from '../tradeshow.service';
import { EventInfo } from '../shared/EventInfo';
import { CommonService } from '../common.service';
import { PageTitleService } from '../pagetitle.service';
import { SideMenuMode } from '../shared/shared';
import { TravelDoc } from '../shared/UserImage';
import { ProfileImageUploadPopupComponent } from '../profile-image-upload-popup/profile-image-upload-popup.component';
import { UserPic } from '../shared/UserImage';

@Component({
  selector: 'app-profile-edit-popup',
  templateUrl: './profile-edit-popup.component.html',
  styleUrls: ['./profile-edit-popup.component.scss']
})

export class ProfileEditPopupComponent implements OnInit {
  private _event: EventInfo;
  private _profile: UserProfile;
  @Output() saveClicked: EventEmitter<UserProfile> = new EventEmitter<UserProfile>();
  currentUser: UserProfile;
  segments: string[];
  showPassportInfo: boolean;
  errorMsg: string;
  isLoading: boolean;
  TravelDocList: Array<TravelDoc> = [];  // display array
  PicInfo: UserPic;
  DeleteDocList: Array<string> = [];  // used to track removal of docs.  Needed because they could add back and assume same file.
  AddDocList: Array<UserPic> = [];

  constructor(
    public activeModal: NgbActiveModal,
    private modal: NgbModal,
    private service: TradeshowService,
    private pagesvc: PageTitleService
  ) { }

  ngOnInit() {
    
    this.service.getMyProfile().subscribe(user => {
      this.currentUser = user;
      this.onInputsChanged();
    });

    this.service.getSegments()
      .subscribe(res => {
        this.segments = res;
        if (res.indexOf(this.profile.Segment) == -1) {
          this.segments.push(this.profile.Segment);
        }
      });
  }

  @Input()
  set profile(profile: UserProfile) {
    this._profile = Object.assign({}, profile);
    this.onInputsChanged();
    if (profile && profile.DOB) {
      const temp = new Date(profile.DOB);
      this._profile.DOB = temp;
    }

    if (profile && profile.PassportExpirationDate) {
      const temp = new Date(profile.PassportExpirationDate);
      this._profile.PassportExpirationDate = temp;
    }
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
    // show passport info?
    this.showPassportInfo = CommonService.canViewPassportInfo(
      this.currentUser, this.profile, this.event
    );

    if (this.profile && this.showPassportInfo) {
      this.loadTravelDocuments(this.profile.Username);
    }
  }

  loadTravelDocuments(username: string) {
    this.service.getTravelDocs(username)
      .subscribe(results => {
        this.TravelDocList = results;
        this.TravelDocList.forEach ( (x) => {
          if (x.Description == "undefined") {
            x.Description = "";
          }
        });
      }, error => {
        console.log(error);
      });
  }

  popupPicUpload() { 
    if (!this.PicInfo) {
      this.PicInfo = {} as UserPic;
    }

    this.PicInfo.PicURL = null;
    this.PicInfo.ShowPassport = this.showPassportInfo;
    this.PicInfo.IsTravel = true;
    
    // pull in the categories used cuz only have one of each.  dummy store in obj 
    var tempstr: string[] = [];
    this.TravelDocList.forEach( (obj) => {
      tempstr.push(obj.Category);
    });
    if (tempstr.length > -1) {
      this.PicInfo.PicURL = tempstr;
    }

    const popupModalRef = this.modal.open(ProfileImageUploadPopupComponent) 
    popupModalRef.componentInstance.userPic = this.PicInfo;
    popupModalRef.componentInstance.saveClicked.subscribe(userPic => {
      this.PicInfo = userPic;
      this.PicInfo.Username = this.profile.Username;
      this.addTravelDoc(this.PicInfo);
    });
  }

  removeTravelDoc(event) {
    let index = Number(event.currentTarget.dataset.index);

    if (index >= 0 && index < this.TravelDocList.length) {
      this.DeleteDocList.push(this.TravelDocList[index].Category);

      // if in addList - remove
      let i = this.AddDocList.findIndex(x => x.Category == this.TravelDocList[index].Category)
      if (i >= 0 && i < this.AddDocList.length) {
        this.AddDocList.splice(i, 1);
      }

      this.TravelDocList.splice(index, 1);
    }
  }

  addTravelDoc(DocInfo: UserPic) {
    let obj = {} as TravelDoc;
    let obj2 = {} as UserPic;   

    // arrays user ref and not physical object - so need to create new objs for both arrays.
    // cannot just copy the objects from a to b because that is still ref.  Need to move each item over.
    obj2.Category = DocInfo.Category;
    obj2.FD = DocInfo.FD;
    if (DocInfo.PicDesc) {
      obj2.PicDesc = DocInfo.PicDesc;
    }
    this.AddDocList.push(obj2);

    obj.Category = DocInfo.Category.toUpperCase();
    obj.ImageType = DocInfo.ImageType; 
    obj.Description = "";
    if (DocInfo.PicDesc && DocInfo.PicDesc.length > 0) {
      obj.Description = DocInfo.PicDesc;
    }
    obj.Image = DocInfo.PicURL;
    this.TravelDocList.push(obj);

    //convert base64 string to byte[] to make all object data the same for image
    //leaving code in for now as commented out to relook at it at a later time.  
    //This approach will pass the info to the api with more coding on api side.  
    //It will need more angular code to view the document before saving via this page.
    /* let b64Data = userpicInfo.PicURL.substring(this.userPicInfo.PicURL.lastIndexOf(";base64,") + 1);
    b64Data = b64Data.substring(7);   
    var binarystr = atob(b64Data);
    var bytes = new Array(binarystr.length);
    for (var i=0; i<binarystr.length; i++)
      {
        bytes[i] = binarystr.charCodeAt(i);
      }
    let byteArray = new Uint8Array(bytes);
    obj.Image = byteArray.buffer; */
  }

  viewTravelDoc(event) {
    var img: string;
    let i = Number(event.currentTarget.dataset.index);

    if (i >= 0 && i < this.TravelDocList.length) {
      let ext: string = this.TravelDocList[i].ImageType.substring(this.TravelDocList[i].ImageType.lastIndexOf("/") + 1);
      let filename: string = this.profile.Username + "-" + this.TravelDocList[i].Category + "." + ext;

      if (this.AddDocList.findIndex(x => x.Category == this.TravelDocList[i].Category) < 0)
      {   
        img = "data:" + this.TravelDocList[i].ImageType + ";base64," + this.TravelDocList[i].Image;
      }
      else {
        img = this.TravelDocList[i].Image;
      }

      this.service.getPhoto(img)
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
  }

  saveChanges() {
    this.isLoading = true;
    this.service.saveUserProfile(this.profile)
      .subscribe(result => {
        this.errorMsg = null;
        if (this.currentUser.FirstName != this.profile.FirstName || 
            this.currentUser.LastName != this.profile.LastName) {
              this.pagesvc.setActivePage(SideMenuMode.Profile);
            }
        
        if (this.DeleteDocList)
        { 
         this.service.deleteTravelDocs(this.profile.Username, this.DeleteDocList)
            .subscribe(x => {
              this.errorMsg = null;
            }, err => {
              this.errorMsg = err;
              this.isLoading = false;
              return;
            }); 
        }
        this.AddDocList.forEach(d => {
          this.service.saveTravelDoc(d.FD, this.profile.Username, d.Category, d.PicDesc)
            .subscribe(result => {
              this.errorMsg = null;
            }, error => { 
              this.errorMsg = error;
              console.log("error loading");
              console.log(error);
              this.isLoading = false;
              return;
            });
        });

        this.saveClicked.emit(result);
        this.isLoading = false;
      }, error => { 
        this.errorMsg = error;
        this.isLoading = false;
      });
  }

  cancelPopup() {
    this.activeModal.close("Cancel clicked");
  }
}
