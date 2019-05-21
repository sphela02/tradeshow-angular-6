import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { load } from '@telerik/kendo-intl';
import { EventAttendee } from '../shared/EventAttendee';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TradeshowService } from '../tradeshow.service';

@Component({
  selector: 'app-attendee-delete-popup',
  templateUrl: './attendee-delete-popup.component.html',
  styleUrls: ['./attendee-delete-popup.component.scss']
})
export class AttendeeDeletePopupComponent implements OnInit {
  @Output() removedClicked = new EventEmitter();

  errorMsg: string;

  private _loading: boolean;
  private _eventID: number;
  private _attendees: { [key: number]: EventAttendee; };
  private _names: Array<string>;

  constructor(
    private service: TradeshowService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  cancelPopup() {
    this.activeModal.close();
  }

  onSubmit() {
    let ids: Array<number> = [];
    Object.keys(this.attendees).forEach(k => {
      ids.push(Number(k));
    });
    this.service.deleteEventAttendees(this.eventID, ids)
      .subscribe(result => {
        this.removedClicked.emit();
        this.activeModal.close();
      }, error => {
        this.errorMsg = error;
      });
  }

  private onInputsChanged() {
    if (this.attendees) {
      this._names = [];
      Object.keys(this.attendees).forEach(k => {
        let attendee: EventAttendee = this.attendees[Number(k)];
        let name: string = attendee.Profile.FirstName + " " + 
                           attendee.Profile.LastName + " (" + 
                           attendee.Username + ")";
        this._names.push(name);
      });
      this._names.sort();
    }
  }

  @Input()
  set eventID(id: number) {
    this._eventID = id;
    this.onInputsChanged();
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

  get names(): Array<string> {
    return this._names;
  }

  get loading(): boolean {
    return this._loading;
  }
  set loading(loading: boolean) {
    this._loading = loading;
  }
}
