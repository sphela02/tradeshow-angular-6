import { Component, OnInit, ViewChild } from '@angular/core';
import { AttendeeViewMode, SideMenuMode } from '../shared/shared';
import { PageTitleService } from '../pagetitle.service';
import { TradeshowService } from '../tradeshow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Permissions, Role } from '../shared/Enums';
import { UserProfile } from '../shared/UserProfile';
import { EventAttendee } from '../shared/EventAttendee';

@Component({
  selector: 'app-attendee-main',
  templateUrl: './attendee-main.component.html',
  styleUrls: ['./attendee-main.component.scss']
})
export class AttendeeMainComponent implements OnInit {
  AttendeeViewMode: typeof AttendeeViewMode = AttendeeViewMode;
  viewMode: AttendeeViewMode = AttendeeViewMode.None;
  currentUser: UserProfile;
  profile: UserProfile;
  attendee: EventAttendee;

  constructor(
    private pagesvc: PageTitleService,
    private service: TradeshowService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // router.events.subscribe((val) => {
    //     // see also
    //     console.log(val);
    // });
    //this.route.params.subscribe(params => console.log(params));
    //showAttendeeInfo(params.urlAfterRedirects.)

    this.route.params.subscribe(params => {
      if (params.id && this.profile) {
        if (this.profile.Username != params.id.toUpperCase()) {
          this.showAttendeeInfo(params.id);
        }
      }
    });

  }

  ngOnInit() {

    this.pagesvc.setLoading(true);
    setTimeout(() => {
      this.pagesvc.setActivePage(SideMenuMode.Attendees, null);
    });

    const id = this.route.snapshot.params.id;

    let mode: AttendeeViewMode = AttendeeViewMode.None;
    if (this.route.snapshot.data[0]) {
      mode = this.route.snapshot.data[0]['viewMode'];
    }

    this.service.getMyProfile()
      .subscribe(me => {
        this.currentUser = me;
        if (me.Privileges == Permissions.None && (
            me.Role == Role.None || me.Role == Role.Attendee)) {
              if (!id || (isNaN(Number(id)) && me.Username != id.toUpperCase())) {
                mode = AttendeeViewMode.MyProfile;
              }
            }
        switch (mode) {
          case AttendeeViewMode.List:
            this.viewMode = mode;
            this.pagesvc.setLoading(false);
            break;
          case AttendeeViewMode.Display:
            this.showAttendeeInfo(id);
            break;
          case AttendeeViewMode.MyProfile:
            this.pagesvc.setLoading(false);
            this.router.navigate(['attendees', me.Username.toLowerCase()]);
            break;
        }
      }, error => {
        this.pagesvc.setLoading(false);
      });
  }

  private showAttendeeInfo(id: any) {
    if (isNaN(Number(id))) {
      this.service.getUserProfile(id)
        .subscribe(profile => {
          this.profile = profile;
          this.viewMode = AttendeeViewMode.Display;
          this.pagesvc.setLoading(false);
        }, error => {
          this.router.navigate(['attendees']);
          this.viewMode = AttendeeViewMode.List;
          this.pagesvc.setLoading(false);
        });
    } else {
      this.service.getEventAttendee(Number(id))
        .subscribe(attendee => {
          this.attendee = attendee;
          this.viewMode = AttendeeViewMode.Display;
          this.pagesvc.setLoading(false);
        }, error => {
          this.router.navigate(['attendees', this.currentUser.Username.toLowerCase()]);
          this.profile = this.currentUser;
          this.viewMode = AttendeeViewMode.Display;
          this.pagesvc.setLoading(false);
        });
    }
  }

}
