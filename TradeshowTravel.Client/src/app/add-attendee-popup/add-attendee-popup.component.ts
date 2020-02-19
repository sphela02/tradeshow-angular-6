import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../shared/UserProfile';
import { UserInfo } from '../shared/UserInfo';
import { EventUser } from '../shared/EventInfo';
import { EventAttendee } from '../shared/EventAttendee';
import { CommonService } from '../common.service';
import { TradeshowService } from '../tradeshow.service';

@Component({
  selector: 'app-add-attendee-popup',
  templateUrl: './add-attendee-popup.component.html',
  styleUrls: ['./add-attendee-popup.component.scss']
})
export class AddAttendeePopupComponent implements OnInit {
  @Input() eventID: number;
  @Output() saveClicked: EventEmitter<any> = new EventEmitter();
  attendee: UserInfo;
  delegate: UserInfo;
  attendees: Array<EventAttendee> = [];
  HelperSvc: typeof CommonService = CommonService;
  isLoading: boolean = false;
  errorMsg: string;
  sendRSVP: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private service: TradeshowService
  ) { }

  ngOnInit() {
  }

  onAttendeeChanged(value: any) {
    if (!value) {
      this.delegate = null;
      return;
    }

    this.service.getUserDelegate(this.attendee.Username)
      .subscribe(user => {
        this.delegate = user;
      }, error => {
        this.delegate = null;
      })
  }

  onSendRSVPChanged(value: any){
    this.attendees.forEach(a => a.SendRSVP = this.sendRSVP);
  }

  addAttendee() {
    if (!this.attendee) {
      return;
    }
    // Already exist?
    if (this.attendees.some(a => {
      if (this.attendee.Username == a.Profile.Username) {
        return true;
      }
    })) {
      this.attendee = null;
      this.delegate = null;
      return;
    }
    let item: EventAttendee = <EventAttendee> {
      ID: 0,
      EventID: this.eventID,
      Username: this.attendee.Username,
      SendRSVP: this.sendRSVP,
      Profile: <UserProfile> {
        Username: this.attendee.Username,
        FirstName: this.attendee.FirstName,
        LastName: this.attendee.LastName,
        Segment: this.attendee.Segment,
        Email: this.attendee.Email,
        DelegateUsername: (this.delegate) ? this.delegate.Username : null,
        Delegate: this.delegate
      }
    };
    this.attendees.push(item);
    this.attendee = null;
    this.delegate = null;
  }

  removeAttendee(event) {
    let index = Number(event.currentTarget.dataset.index);
    if (index >= 0 && index < this.attendees.length) {
      this.attendees.splice(index, 1);
    }
  }

  cancelPopup() {
    this.activeModal.close();
  }

  onSubmit() {
    this.addAttendee();

    if (!this.attendees.length) {
      return;
    }

    this.errorMsg = null;
    this.isLoading = true;
    this.service.saveEventAttendees(this.eventID, this.attendees)
      .subscribe(result => {
        this.errorMsg = null;
        this.isLoading = false;
        this.saveClicked.emit();
        this.activeModal.close();
      }, error => {
        this.errorMsg = error;
        this.isLoading = false;
      });
  }
}
