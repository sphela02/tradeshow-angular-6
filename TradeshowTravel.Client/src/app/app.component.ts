import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { TradeshowService } from './tradeshow.service';
import { UserProfile } from './shared/UserProfile';
import { PageTitleService } from './pagetitle.service';
import { SideMenuMode } from './shared/shared';
import { Role, Permissions } from './shared/Enums';
import { environment } from '../environments/environment';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';

declare var $: any;

@Component({
  selector: 'tt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  Role: typeof Role = Role;
  SideMenuMode: typeof SideMenuMode = SideMenuMode;
  userProfile: UserProfile;
  showProfileAvatar: boolean = false;
  activeMenu: SideMenuMode;
  activeChildmenu: string;
  showEventsMenu: boolean;
  showAdminMenu: boolean;
  avatar: string | any;
  baseurl: string;

  private pageTitleSubscription: Subscription;
  private appLoadingSubscription: Subscription;

  constructor(
    private _service: TradeshowService,
    private _pageTitleService: PageTitleService,
    private _authService:AuthService,
    private location: Location) {
    let url: string = this.location.normalize(environment.imgLibraryURL);
    if (url.indexOf("http") == -1) {
      url = this.location.prepareExternalUrl(url);
    }
    this.baseurl = url;
  }

  ngOnInit() {  
    this.reloadProfile();

    this.pageTitleSubscription = this._pageTitleService
      .message.subscribe(menuItem => {
        if (menuItem) {
          this.activeChildmenu = menuItem.childMenu;
          this.activeMenu = menuItem.mainMenu;
          if (this.activeMenu == SideMenuMode.Profile) {
            this.reloadProfile();
          }
        }
      });

    this.appLoadingSubscription = this._pageTitleService
      .loading.subscribe(isLoading => {
        if (isLoading) {
          $('body').addClass('loading');
        } else {
          $('body.loading').removeClass('loading');
        }
      });

    setTimeout(() => {
      $("#sidebarCollapse").sideNav();
    }, 0);
  }

  private reloadProfile() {
    this._service.getMyProfile()
      .subscribe(profile => {
        this.userProfile = profile;
        this.showProfileAvatar = profile.ShowPicture;
        this.showAdminMenu = profile.Privileges == Permissions.Admin;
        this.showEventsMenu = profile.Privileges != Permissions.None || (
          profile.Role != Role.None && profile.Role != Role.Attendee
        );

        if (profile.Username) {
          this._service.getAvatar(profile.Username.toUpperCase())
            .subscribe(result => {
              if (result) {
                this.createImageFromBlob(result);
              }
              else {
                this.avatar = this.baseurl + '/' + profile.EmplID + ".jpg"
              }
            }, error => {
              console.log("Getting avatar error", JSON.stringify(error));
            })
        }
      });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.avatar = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  ngOnDestroy() {
    this.pageTitleSubscription.unsubscribe();
    this.appLoadingSubscription.unsubscribe();
  }

  imgErrHandler(event) {
    // error on img load 
    if (this.avatar && this.avatar.length > 0) {
      this.showProfileAvatar = false;
    }
  }
}
