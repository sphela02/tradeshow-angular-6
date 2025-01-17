import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { EventInfo } from '../shared/EventInfo';
import { EventAttendee } from '../shared/EventAttendee';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TradeshowService } from '../tradeshow.service';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { TextAreaDirective } from '@progress/kendo-angular-inputs';
import { RsvpRequest } from '../shared/RsvpRequest';
import { AttendeeStatus } from '../shared/Enums';
import { FileAttachmentComponent } from '../file-attachment/file-attachment.component'

import { UserProfile } from '../shared/UserProfile';

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
  @ViewChild(TextAreaDirective) private emailTextArea: TextAreaDirective;
  @ViewChild(FileAttachmentComponent) private fileAttachmentComponent: FileAttachmentComponent;

  private _loading: boolean;
  private _request: RsvpRequest = <RsvpRequest>{};
  private _event: EventInfo
  private _attendees: { [key: number]: EventAttendee; };
  private _names: Array<string>;

  private _currentUser: UserProfile;

  errorMsg: string;

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
        + "\nEvent Management\nTeam L3Harris Technologies";
    });

      // set up attachment component
    this.fileAttachmentComponent.selectedAttachmentsChange.subscribe(allAttachments => {
      this.request.Attachments = allAttachments
    });
    this.fileAttachmentComponent.errorMsg.subscribe(error => {
      this.errorMsg = error;
    });
    this.fileAttachmentComponent.isLoading.subscribe(isLoading => {
      this.loading = isLoading;
    });
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

    this.service.sendRsvpRequest(this.event.ID, this.request)
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
