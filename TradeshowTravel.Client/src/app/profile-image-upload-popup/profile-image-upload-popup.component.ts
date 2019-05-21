import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserProfile } from '../shared/UserProfile';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, NgModel } from '@angular/forms';
import { TradeshowService } from '../tradeshow.service';
import { EventInfo } from '../shared/EventInfo';
import { CommonService } from '../common.service';
import { PageTitleService } from '../pagetitle.service';
import { SideMenuMode } from '../shared/shared';
import { HttpClient } from '@angular/common/http';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { UserPic } from '../shared/UserImage';

@Component({
  selector: 'app-root',
  templateUrl: './profile-image-upload-popup.component.html',
  styleUrls: ['./profile-image-upload-popup.component.scss']
})

export class ProfileImageUploadPopupComponent implements OnInit {
  private _event: EventInfo;
  private _userPic: UserPic;
  errorMsg: string;
  isLoading: boolean;
  selectedFile: File = null;
  showProfilePic: boolean;
  pic: any;
  selectedPic: any;
  isTravelDoc: boolean = false;
  categorys: Array<string> = ["PASSPORT", "VISA", "OTHER"];
  selectedCategory: string = null;
  @ViewChild("description") private description: ElementRef;
  @Output() saveClicked: EventEmitter<UserPic> = new EventEmitter<UserPic>();

  constructor(
    public activeModal: NgbActiveModal,
    private service: TradeshowService,
    private pagesvc: PageTitleService,
    private http: HttpClient
  ) { }
  
  @Input()
  set userPic(userPic: UserPic){
    this._userPic = userPic;
    if (this._userPic) {
      this.pic = this._userPic.PicURL;
      this.selectedPic = this._userPic.PicURL;
      this.showProfilePic = this._userPic.ShowPicture;
      this.isTravelDoc = this.userPic.IsTravel;
    }
  }
  get userPic(): UserPic {
    return this._userPic;
  }

  ngOnInit() {
    if (this.isTravelDoc) {
      document.getElementById("SaveButton").innerText = "Update";
      this.pic = "assets/uploadDoc.png"

      // only show categories that have no db entry - cuz part of db key
      // using picurl as dummy holding spot
      let x : string[] = this._userPic.PicURL;
      for (var i = 0; i < x.length; i++ ) {
        if (this.categorys.indexOf(x[i]) > -1) {
          this.categorys.splice(this.categorys.indexOf(x[i]), 1);
        }
      }
      this._userPic.PicURL = null; 
    }
  }

  onChange(value: any) {
    if (value) {
     this.selectedCategory = value;
    }
  }    

  onFileSelected(event) {
    this.isLoading = true;
    this.errorMsg = null;

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      var mimeType = event.target.files[0].type;

       if (mimeType.match(/image\/*/) == null) {
          if (!this.isTravelDoc) {
            this.errorMsg = "Only images are supported.";
            this.isLoading = false;
            return;
          }
           // cannot do match here cuz it hangs for some reason
           else if (mimeType != "application/pdf") {
            this.errorMsg = "Only images & pdf are supported.";
            this.isLoading = false;
            return;            
          } 
        }   
      
      //this.showProfilePic = true;
      this.selectedFile = <File>event.target.files[0];

      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (event) => { 
        this.pic = reader.result;  
        this.selectedPic = reader.result;
        if (mimeType == "application/pdf")
        {
          this.pic = "assets/pdf.jpg"
        }
      }
      this.isLoading = false;
    }
  }

  onUpload() {

    // do error checking for req field.  Could not get to work in html.
    if (!this.selectedFile) {
      this.errorMsg = "Please enter a file.";
      return;
    }
    if (this.isTravelDoc && !this.selectedCategory) {
      this.errorMsg = "Please select a category.";
      return;
    }

    this.isLoading = true;
    this.errorMsg = null;

    const fd =  new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);

    if (this.isTravelDoc && this.selectedFile && this.selectedCategory) {
      this._userPic.PicURL = this.selectedPic;
      this._userPic.Category = this.selectedCategory;
      this._userPic.ImageType = this.selectedFile.type; 
      this._userPic.FD = fd;
      this._userPic.FileName = this.selectedFile.name;

      if (this.description.nativeElement.value) {
       this._userPic.PicDesc = this.description.nativeElement.value;
      }
      
      this.saveClicked.emit(this._userPic);
      this.activeModal.close();
    }

    if (this._userPic.Category.toUpperCase() == 'AVATAR') {          
      this.service.saveAvatar(fd, this._userPic.Username)
        .subscribe(result => {
          this.pagesvc.setActivePage(SideMenuMode.Profile);
          this.errorMsg = null;
          this._userPic.PicURL = this.selectedPic;
          this.saveClicked.emit(this._userPic);
          this.isLoading = false;
          this.activeModal.close();
        }, error => { 
          this.errorMsg = error;
          this.isLoading = false;
        });
    }
  }

  imgErrHandler(event) {
   // error on img load 
    if (this.pic.length > 0) {
      this.showProfilePic = false;
    }   
  }

  cancelPopup() {
    this.activeModal.close("Cancel clicked");
  }
}
