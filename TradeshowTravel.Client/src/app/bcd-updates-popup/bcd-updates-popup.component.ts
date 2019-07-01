import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { EventInfo, EventField } from '../shared/EventInfo';
import { Router } from '@angular/router';
import { PageTitleService } from '../pagetitle.service';
import { SideMenuMode, EventDisplayTab } from '../shared/shared';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventEditPopupComponent } from '../event-edit-popup/event-edit-popup.component';
import { Role, InputType, ShowType, Permissions } from '../shared/Enums';
import { UserInfo } from '../shared/UserInfo';
import { EventDeletePopupComponent } from '../event-delete-popup/event-delete-popup.component';
import { TradeshowService } from '../tradeshow.service';
import { EventUsersPopupComponent } from '../event-users-popup/event-users-popup.component';
import { GridComponent, DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { EventFieldPopupComponent } from '../event-field-popup/event-field-popup.component';
import { CommonService } from '../common.service';
import { AttendeeFieldsFilterPipe } from '../shared/pipes/attendee-fields-filter.pipe';
import { OrganizerFieldsFilterPipe } from '../shared/pipes/organizer-fields-filter.pipe';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';
import { AddAttendeePopupComponent } from '../add-attendee-popup/add-attendee-popup.component';
import { EventAttendeeQueryResult } from '../shared/EventAttendeeQuery';
import { QueryParams, SortParams, FilterParams } from '../shared/QueryParams';
import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { UserProfile } from '../shared/UserProfile';
import { EventAttendee } from '../shared/EventAttendee';
import { ProfileEditPopupComponent } from '../profile-edit-popup/profile-edit-popup.component';
import { AttendeeFieldsPopupComponent } from '../attendee-fields-popup/attendee-fields-popup.component';
import { AttendeeDeletePopupComponent } from '../attendee-delete-popup/attendee-delete-popup.component';
import { SendRsvpPopupComponent } from '../send-rsvp-popup/send-rsvp-popup.component';
import { SendReminderPopupComponent } from '../send-reminder-popup/send-reminder-popup.component';
import { AttendeeStatus } from '../shared/Enums';

declare var $: any;

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'bcd-updates-popup-title',
  templateUrl: './bcd-updates-popup.component.html',
  styleUrls: ['./bcd-updates-popup.component.scss']
})
export class BcdUpdatesPopupComponent implements OnInit {
  _eventID: number;
  _event: EventInfo;
  attendee: UserInfo;
  delegate: UserInfo;
  attendees: Array<EventAttendee> = [];
  HelperSvc: typeof CommonService = CommonService;
  isLoading: boolean = false;
  errorMsg: string;
  sendRSVP: boolean = false;
  title: string;

  @Input() bcdPopupTitle: string;

  constructor(
    private activeModal: NgbActiveModal,
    private service: TradeshowService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    
  }

  @Input()
  set eventID(eventID: number) {
    this._eventID = eventID;
  }
  get eventID(): number {
    return this._eventID;
  }

  @Input()
  set event(event: EventInfo) {
    this._event = event;
    this.title = event.Name;
  }
  get event(): EventInfo {
    return this._event;
  }

  closeResult: string;

  cancelPopup() {

    this.activeModal.close();
  }

  onSubmit() {
  }
}
