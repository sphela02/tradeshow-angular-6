import { Component, OnInit, ViewChild } from '@angular/core';
import { PageTitleService } from '../pagetitle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventViewMode, SideMenuMode } from '../shared/shared';
import { TradeshowService } from '../tradeshow.service';
import { Permissions, Role } from '../shared/Enums';
import { EventListComponent } from '../event-list/event-list.component';
import { EventViewComponent } from '../event-view/event-view.component';
import { EventInfo } from '../shared/EventInfo';

@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.component.html',
  styleUrls: ['./event-main.component.scss']
})
export class EventMainComponent implements OnInit {
  activeEvent: EventInfo;
  EventViewMode: typeof EventViewMode = EventViewMode;
  viewMode: EventViewMode = EventViewMode.None;
  @ViewChild(EventListComponent) childList: EventListComponent;
  @ViewChild(EventViewComponent) childView: EventViewComponent;

  constructor(private pagetitle: PageTitleService,
              private service: TradeshowService,
              private router: Router,
              private route: ActivatedRoute
              ) { }
  ngOnInit() {

    this.pagetitle.setLoading(true);

    setTimeout(() => {
      this.pagetitle.setActivePage(SideMenuMode.Events, null);
    });

    const eventID: number = this.route.snapshot.params.id;
    
    let mode: EventViewMode = EventViewMode.List;
    if (this.route.snapshot.data[0]) {
      mode = this.route.snapshot.data[0]['eventViewMode'];
    }

    // Validate user can be here
    this.service.getMyProfile()
      .subscribe(me => {
        if (me.Privileges == Permissions.None && (
            me.Role == Role.None || me.Role == Role.Attendee
            )) {
              this.router.navigate(['attendees', me.Username.toLowerCase()]);
              return;
            }

        this.pagetitle.setLoading(false);
        switch (mode) {
          case EventViewMode.List:
            this.viewMode = mode;
            break;
          case EventViewMode.Display:
            this.showEventInfo(eventID);
            break;
        }
      }, err => {
        this.router.navigate(['events']);
        this.viewMode = EventViewMode.None;
        this.pagetitle.setLoading(false);
      });
  }

  private showEventInfo(eventID: number) {
    this.viewMode = EventViewMode.None;
    this.service.getEventInfo(eventID)
      .subscribe(event => {
        this.activeEvent = event;
        this.viewMode = EventViewMode.Display;
      }, err => {
        this.router.navigate(['events']);
        this.viewMode = EventViewMode.List;
      });
  }

}
