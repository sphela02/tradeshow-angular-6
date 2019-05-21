import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserProfile } from '../shared/UserProfile';
import { TradeshowService } from '../tradeshow.service';
import { AttendeeEvent } from '../shared/AttendeeEvent';
import { AttendeeStatus, Role } from '../shared/Enums';
import { PageTitleService } from '../pagetitle.service';
import { SideMenuMode, AttendeeDisplayTab, EventStatusFilter } from '../shared/shared';
import { EventAttendee } from '../shared/EventAttendee';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttendeeRsvpPopupComponent } from '../attendee-rsvp-popup/attendee-rsvp-popup.component';
import { EventInfo } from '../shared/EventInfo';
import { CommonService } from '../common.service';
import { AttendeeFieldsComponent } from '../attendee-fields/attendee-fields.component';

@Component({
  selector: 'app-attendee-view',
  templateUrl: './attendee-view.component.html',
  styleUrls: ['./attendee-view.component.scss']
})
export class AttendeeViewComponent implements OnInit {
  @ViewChild(AttendeeFieldsComponent) attendeeFields: AttendeeFieldsComponent;
  Role: typeof Role = Role;
  AttendeeStatus: typeof AttendeeStatus = AttendeeStatus;
  AttendeeDisplayTab: typeof AttendeeDisplayTab = AttendeeDisplayTab;
  EventStatusFilter: typeof EventStatusFilter = EventStatusFilter;

  private _currentUser: UserProfile;
  private _profile: UserProfile;
  private _attendee: EventAttendee;
  private _events: Array<AttendeeEvent>;
  private _filteredevents: Array<AttendeeEvent>;

  activeTab: AttendeeDisplayTab = AttendeeDisplayTab.Profile;
  selectedStatus: EventStatusFilter = EventStatusFilter.Upcoming;

  constructor(
    private service: TradeshowService,
    private pagesvc: PageTitleService,
    private modal: NgbModal
  ) { }

  ngOnInit() {
    this.service.getMyProfile().subscribe(me => {
      this._currentUser = me;
      this.onAttendeeInputChanged();
    });
  }

  onTabClicked(activeTab: AttendeeDisplayTab) {
    this.activeTab = activeTab;
  }
  onTabClose(event) {
    event.stopPropagation();
    this.attendee = null;
    this.onTabClicked(AttendeeDisplayTab.Profile);
  }

  onStatusFilterClicked(status: EventStatusFilter) {
    if (this.selectedStatus != status) {
      this.selectedStatus = status;
      this.filterAttendeeEvents();
    }
  }

  private filterAttendeeEvents() {
    switch (this.selectedStatus) {
      case EventStatusFilter.Upcoming:
        this._filteredevents = this.events.filter(
          x => (new Date(Date.now()) < new Date(x.StartDate))
        );
        break;
      case EventStatusFilter.Past:
        this._filteredevents = this.events.filter(
          x => (new Date(Date.now()) >= new Date(x.StartDate))
        );
        break;
    }
  }

  get filteredevents(): Array<AttendeeEvent> {
    return this._filteredevents;
  }

  private loadAttendeeEvents() {
    if (this.profile) {
      this.pagesvc.setLoading(true);
      this.service.getAttendeeEvents(this.profile.Username)
        .subscribe(events => {
          this.events = events;
          this.pagesvc.setLoading(false);
        }, error => {
          this.pagesvc.setLoading(false);
        });
    }
  }

  onAttendeeClicked(attendeeID: number) {
    if (this.attendee && this.attendee.ID == attendeeID) {
      this.onTabClicked(AttendeeDisplayTab.Attendee);
      return;
    }
    this.service.getEventAttendee(attendeeID)
      .subscribe(attendee => {
        if (this.profile && attendee.Username == this.profile.Username) {
          //attendee.Profile = this.profile;
        }
        this.attendee = attendee;
      }, error => {
        this.onTabClicked(AttendeeDisplayTab.Profile);
      });
  }

  onEventChanged(event: EventInfo) {
    if (this.attendee) {
      this.attendee.Event = event;
    }
    this.loadAttendeeEvents();
  }
  onProfileChanged(profile: UserProfile) {
    if (this.attendee) {
      if (this.attendee.Username == profile.Username) {
        this.attendee.Profile = profile;
      }
    }
    if (this.profile.Username == profile.Username) {
      this.profile = profile;
    }
  }
  onAttendeeChanged() {
    this.loadAttendeeEvents();
  }

  private popupRsvp() {
    const modalOptions: NgbModalOptions = { size: "lg", backdrop: "static" };
    const popupModalRef = this.modal.open(AttendeeRsvpPopupComponent, modalOptions);
    popupModalRef.componentInstance.attendee = this.attendee;
    popupModalRef.result.then((attendee) => {
      if (CommonService.getYesOrNoText(attendee.IsAttending) == "Yes") {
        this.attendee.IsAttending = "Yes";
        this.onTabClicked(AttendeeDisplayTab.Attendee);
        this.attendeeFields.popupEditFields();
      } else {
        this.attendee = null;
        this.loadAttendeeEvents();
        this.onTabClicked(AttendeeDisplayTab.Profile);
      }
    }, (reason) => {
      this.attendee = null;
      this.onTabClicked(AttendeeDisplayTab.Profile);
    });
  }

  private onProfileInputChanged() {
    if (this.profile) {
      setTimeout(() => {
        this.pagesvc.setActivePage(SideMenuMode.Attendees,
          this.profile.FirstName + " " + this.profile.LastName
        )
      });
      if (this.attendee && this.attendee.Username == this.profile.Username) {
        this.attendee.Profile = this.profile;
      }
      this.loadAttendeeEvents();
    }
  }

  private onAttendeeInputChanged() {
    if (this.attendee && this.currentUser) {
      if (!this.profile) {
        this.profile = this.attendee.Profile;
      }
      if (this.attendee.Username == this.currentUser.Username) {
        const today = new Date(Date.now());
        const start = new Date(this.attendee.Event.StartDate);
        if (!this.attendee.IsAttending && (today < start)) {
          window.setTimeout(() => {
            this.popupRsvp();
          }, 0);
          return;
        }
      }
      this.onTabClicked(AttendeeDisplayTab.Attendee);
    }
  }

  @Input()
  set profile(profile: UserProfile) {
    this._profile = profile;
    this.onProfileInputChanged();
  }
  get profile(): UserProfile {
    return this._profile;
  }

  @Input()
  set attendee(attendee: EventAttendee) {
    this._attendee = attendee;
    this.onAttendeeInputChanged();
  }
  get attendee(): EventAttendee {
    return this._attendee;
  }

  get currentUser(): UserProfile {
    return this._currentUser;
  }

  get events(): Array<AttendeeEvent> {
    return this._events;
  }
  set events(events: Array<AttendeeEvent>) {
    this._events = events;
    this.filterAttendeeEvents();
    if ((events && events.length) &&
        (!this.filteredevents || !this.filteredevents.length)) {
        switch (this.selectedStatus) {
          case EventStatusFilter.Upcoming:
          this.onStatusFilterClicked(EventStatusFilter.Past);
          break;
          case EventStatusFilter.Past:
          this.onStatusFilterClicked(EventStatusFilter.Upcoming);
          break;
        }
    }
  }
}
