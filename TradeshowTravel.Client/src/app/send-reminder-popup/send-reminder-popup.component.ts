import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TextAreaDirective } from '@progress/kendo-angular-inputs';
import { ReminderRequest } from '../shared/ReminderRequest';
import { EventAttendee } from '../shared/EventAttendee';
import { AttendeeStatus } from '../shared/Enums';
import { TradeshowService } from '../tradeshow.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const REMINDER_TEMPLATE = `Hello <EventAttendee.Name>,

We would like to inform you about <EventInfo.Name>!

Thank you,`;

@Component({
  selector: 'app-send-reminder-popup',
  templateUrl: './send-reminder-popup.component.html',
  styleUrls: ['./send-reminder-popup.component.scss']
})
export class SendReminderPopupComponent implements OnInit {
  @Output() sendClicked = new EventEmitter();
  @ViewChild(TextAreaDirective) private emailTextArea: TextAreaDirective

  private _loading: boolean;
  private _request: ReminderRequest = <ReminderRequest>{};
  private _eventID: number;
  private _attendees: { [key: number]: EventAttendee; };
  private _names: Array<string>;

  errorMsg: string;

  constructor(
    private service: TradeshowService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.service.getEventInfo(this._eventID).subscribe(event => {
      this.service.getUserProfile(event.Owner.Username).subscribe(profile => {
        this.request.EmailText = REMINDER_TEMPLATE
          + "\n\n" + profile.FirstName + " " + profile.LastName
          + "\n" + profile.Email
          + "\n" + profile.Telephone
          + "\nEvent Management\nTeam Harris Corporation";
      });
    });
  }

  @Input()
  set eventID(eventID: number) {
    this._eventID = eventID;
  }
  get eventID(): number {
    return this._eventID;
  }

  @Input()
  set attendees(attendees: { [key: number]: EventAttendee; }) {
    this._attendees = attendees;
    this.onInputsChanged();
  }
  get attendees(): { [key: number]: EventAttendee; } {
    return this._attendees;
  }

  set request(request: ReminderRequest) {
    this._request = request;
  }
  get request(): ReminderRequest {
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
    if (!this.request.EmailText) {
      return false;
    }

    return true;
  }

  private onInputsChanged() {
    if (this.attendees) {
      this.request.AttendeeIDs = [];
      this._names = [];
      Object.keys(this.attendees).forEach(k => {
        let attendee: EventAttendee = this.attendees[Number(k)];
        let name: string = attendee.Profile.FirstName + " " +
                            attendee.Profile.LastName + " (" +
                            attendee.Username + ")";
        this._names.push(name);
        this.request.AttendeeIDs.push(Number(k));
      });
      this._names.sort();
    }
  }

  onSubmit() {
    if (!this.isValid) {
      return;
    }
    this.loading = true;
    this.service.sendReminder(this.eventID, this.request)
      .subscribe(resp => {
        this.loading = false;
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
