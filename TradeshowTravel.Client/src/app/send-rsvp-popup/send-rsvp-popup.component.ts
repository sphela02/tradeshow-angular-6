import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { EventInfo } from '../shared/EventInfo';
import { EventAttendee } from '../shared/EventAttendee';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TradeshowService } from '../tradeshow.service';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { TextAreaDirective } from '@progress/kendo-angular-inputs';
import { RsvpRequest } from '../shared/RsvpRequest';
import { AttendeeStatus } from '../shared/Enums';

import { UserProfile } from '../shared/UserProfile';
import { Alert } from 'selenium-webdriver';

const RSVP_TEMPLATE = `Hello <EventAttendee.Name>,

We would like to inform you that you have been nominated to attend <EventInfo.Name>!  RSVP by <Event.RsvpDueDate> to attend.

Please Review : <Page: EventInfo.Name>

Thank you,`;

@Component({
  selector: 'app-send-rsvp-popup',
  templateUrl: './send-rsvp-popup.component.html',
  styleUrls: ['./send-rsvp-popup.component.scss']
})
export class SendRsvpPopupComponent implements OnInit {
  @Output() sendClicked = new EventEmitter();
  @ViewChild("rsvpDueDate") private RsvpDueDate: DatePickerComponent;
  @ViewChild(TextAreaDirective) private emailTextArea: TextAreaDirective

  private _loading: boolean;
  private _request: RsvpRequest = <RsvpRequest>{};
  private _event: EventInfo
  private _attendees: { [key: number]: EventAttendee; };
  private _names: Array<string>;

  private _currentUser: UserProfile;

  errorMsg: string;
  attachmentList: File[];

  constructor(
    private activeModal: NgbActiveModal,
    private service: TradeshowService
  ) { }

  ngOnInit() {
    this.service.getUserProfile(this._event.Owner.Username).subscribe(profile => {
      this.request.EmailText = RSVP_TEMPLATE
        + "\n\n" + profile.FirstName + " " + profile.LastName
        + "\n" + profile.Email
        + "\n" + profile.Telephone
        + "\nEvent Management\nTeam Harris Corporation";
    });

    this.attachmentList = [];
  }

  @Input()
  set event(event: EventInfo) {
    this._event = event;
    this.onInputsChanged();
  }
  get event(): EventInfo {
    return this._event;
  }

  @Input()
  set attendees(attendees: { [key: number]: EventAttendee; }) {
    this._attendees = attendees;
    this.onInputsChanged();
  }
  get attendees(): { [key: number]: EventAttendee; } {
    return this._attendees;
  }

  set request(request: RsvpRequest) {
    this._request = request;
  }
  get request(): RsvpRequest {
    return this._request;
  }

  get names(): Array<string> {
    return this._names;
  }

  get loading(): boolean {
    return this._loading;
  }
  set loading(loading: boolean) {
    this._loading = loading;
  }

  get isValid(): boolean {
    if (!this.request || !this.request.AttendeeIDs) {
      return false;
    }
    if (!this.request.AttendeeIDs.length) {
      return false;
    }
    if (!this.request.DueDate) {
      return false;
    }
    if (!this.request.EmailText) {
      return false;
    }

    return true;
  }

  onFileSelected(event) {
    this.errorMsg = null;
    if (event.target.files && event.target.files[0]) {
      var isExist = false;
      for (var i = 0; i < this.attachmentList.length; i++) {
        if (this.attachmentList[i].name == event.target.files[0].name && this.attachmentList[i].size == event.target.files[0].size) {
          isExist = true;
          this.errorMsg = "Attachment already added.";
        }
      }

      if (!isExist) {
        this.attachmentList.push(<File>event.target.files[0]);
      }
    }
  }

  onRemoveAttachment(index) {
    this.attachmentList.splice(index, 1);
  }

  private onInputsChanged() {
    if (this.event) {
      if (this.event.StartDate) {
        this.event.StartDate = new Date(this.event.StartDate);
        this.RsvpDueDate.max = this.event.StartDate;
      }
      if (this.event.RsvpDueDate) {
        this.event.RsvpDueDate = new Date(this.event.RsvpDueDate);
        this.request.DueDate = this.event.RsvpDueDate;
      }
    }

    if (this.attendees) {
      this.request.AttendeeIDs = [];
      this._names = [];
      Object.keys(this.attendees).forEach(k => {
        let attendee: EventAttendee = this.attendees[Number(k)];
        if (attendee.Status == AttendeeStatus.Pending ||
          attendee.Status == AttendeeStatus.Invited) {
          let name: string = attendee.Profile.FirstName + " " +
            attendee.Profile.LastName + " (" +
            attendee.Username + ")";
          this._names.push(name);
          this.request.AttendeeIDs.push(Number(k));
        }
      });
      this._names.sort();
    }
  }

  onSubmit() {
    if (!this.isValid) {
      return;
    }

    this.loading = true;

    var fd = new FormData();

    for (var key in this.request) {
      alert(this.request[key]);
      fd.append(key, this.request[key]);
    }
    for (var i = 0; i < this.attachmentList.length; i++) {
      fd.append('file', this.attachmentList[i], this.attachmentList[i].name);
    }

    this.service.sendRsvpRequest(this.event.ID, fd)
      .subscribe(resp => {
        this.loading = false;
        this.event.RsvpDueDate = this.request.DueDate;
        this.sendClicked.emit();
        this.activeModal.close();
      }, error => {
        this.errorMsg = error;
        this.loading = false;
      });
  }

  cancelPopup() {
    this.activeModal.close();
  }
}
