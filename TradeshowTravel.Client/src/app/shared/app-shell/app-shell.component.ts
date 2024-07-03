import { Component, OnInit } from '@angular/core';
import { Role, Permissions } from '../Enums';
import { SideMenuMode } from '../shared';
import { UserProfile } from '../UserProfile';
import { Subscription } from 'rxjs';
import { TradeshowService } from '../../tradeshow.service';
import { PageTitleService } from '../../pagetitle.service';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';





declare var $: any;

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements OnInit {
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
