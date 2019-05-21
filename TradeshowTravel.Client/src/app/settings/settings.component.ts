import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../pagetitle.service';
import { TradeshowService } from '../tradeshow.service';
import { SideMenuMode } from '../shared/shared';
import { Permissions } from '../shared/Enums';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  privileges: Array<{ name: string, value: Permissions }>;

  constructor(
    private pagesvc: PageTitleService,
    private service: TradeshowService
  ) { }

  ngOnInit() {

    setTimeout(() => {
      this.pagesvc.setActivePage(SideMenuMode.Settings, null)
    });

    this.privileges = [];
    Object.keys(Permissions)
      .filter(f => !isNaN(Number(f)) && Number(f) > 0)
      .forEach(key => {
        let permission: Permissions = Number(key);
        let privilege = { name: null, value: permission };
        switch (permission) {
          case Permissions.Admin:
            privilege.name = "Admin Users";
            break;
          case Permissions.CreateShows:
            privilege.name = "Event Organizers"
            break;
        }
        this.privileges.push(privilege);
      });
    this.privileges.sort((a,b): number => { 
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1: 0)
    });
    
  }

}
