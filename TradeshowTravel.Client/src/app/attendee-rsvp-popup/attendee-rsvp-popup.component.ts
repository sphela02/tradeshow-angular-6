import { Component, OnInit, Input } from '@angular/core';
import { EventInfo } from '../shared/EventInfo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventAttendee } from '../shared/EventAttendee';
import { TradeshowService } from '../tradeshow.service';

@Component({
  selector: 'app-attendee-rsvp-popup',
  templateUrl: './attendee-rsvp-popup.component.html',
  styleUrls: ['./attendee-rsvp-popup.component.scss']
})
export class AttendeeRsvpPopupComponent implements OnInit {

  private _attendee: EventAttendee;

  isLoading: boolean = false;
  isDisclaimerChecked: boolean;
  errorMsg: string;

  constructor(
    private activeModal: NgbActiveModal,
    private service: TradeshowService
  ) { }

  ngOnInit() {
    this.isDisclaimerChecked = this.attendee.IsAttending === "Yes";
  }

  cancelPopup() {
    this.activeModal.dismiss();
  }

  onYesClicked() {
    let attendee: EventAttendee = Object.assign({}, this.attendee);
    attendee.IsAttending = "Yes";
    //this.saveAttendee();
    this.activeModal.close(attendee);
  }

  onNoClicked() {
    this.attendee.IsAttending = "No";
    this.saveAttendee();
  }

  private saveAttendee() {
    this.isLoading = true;
    this.service.saveAttendee(this.attendee.EventID, this.attendee)
      .subscribe(attendee => {
        this.isLoading = false;
        attendee.Event = this.attendee.Event;
        this.activeModal.close(attendee);
      }, error => {
        this.isLoading = false;
        this.errorMsg = error;
      });
  }

  @Input()
  set attendee(attendee: EventAttendee) {
    this._attendee = attendee;
  }
  get attendee(): EventAttendee {
    return this._attendee;
  }
}
