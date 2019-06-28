import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputType, Role } from '../shared/Enums';
import { EventInfo, EventField } from '../shared/EventInfo';
import { EventAttendee } from '../shared/EventAttendee';
import { TradeshowService } from '../tradeshow.service';
import { UserProfile } from '../shared/UserProfile';
import { CommonService } from '../common.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AttendeeFieldsPopupComponent } from '../attendee-fields-popup/attendee-fields-popup.component';

@Component({
  selector: 'app-attendee-fields',
  templateUrl: './attendee-fields.component.html',
  styleUrls: ['./attendee-fields.component.scss']
})
export class AttendeeFieldsComponent implements OnInit {
  @Output() attendeeChange = new EventEmitter();
  @Input() title: string;

  InputType: typeof InputType = InputType;

  private _filter: Role = Role.None;
  private _event: EventInfo;
  private _attendee: EventAttendee;
  private _fields: Array<EventField>;

  values: { [key: number]: any } = {};
  canEdit: boolean;
  completionText: string;
  currentUser: UserProfile;

  constructor(
    private service: TradeshowService,
    private modal: NgbModal
  ) { }

  ngOnInit() {
    this.service.getMyProfile().subscribe(user => {
      this.currentUser = user;
      this.onInputsChanged();
    });
  }

  private onInputsChanged() {
    if (this.event && this.event.Fields && this.filter) {
      this._fields = this.event.Fields.filter(
        f => this.filter == f.Access && f.Included
      );
    } else {
      this._fields = (this.event) ? this.event.Fields.filter(
        f => f.Included
      ) : null;
    }

    // Load values
    if (this.fields && this.attendee) {
      this.fields.forEach(f => {
        switch (f.Input) {
          case InputType.LongText:
          case InputType.ShortText:
          case InputType.Select:
            if (f.Source) {
              this.values[f.ID] = this.attendee[f.Source];
            } else {
              this.values[f.ID] = this.attendee.Properties[f.ID];
            }
            break;
          case InputType.Date:
            var dt = null;
            if (f.Source && this.attendee[f.Source]) {
              dt = new Date(this.attendee[f.Source]);
            }
            else if (!f.Source && this.attendee.Properties[f.ID]) {
              dt = new Date(this.attendee.Properties[f.ID])
            }
            this.values[f.ID] = dt;
            break;
          case InputType.YesOrNo:
            if (f.Source) {
              this.values[f.ID] = CommonService.getYesOrNoText(this.attendee[f.Source]);
            } else {
              this.values[f.ID] = CommonService.getYesOrNoText(this.attendee.Properties[f.ID]);
            }
            break;
          case InputType.MultiSelect:
            var list = [];
            if (f.Source && this.attendee[f.Source]) {
              list = this.attendee[f.Source].split('|');
            }
            else if (!f.Source && this.attendee.Properties[f.ID]) {
              list = this.attendee.Properties[f.ID].split('|');
            }
            this.values[f.ID] = list.join(", ");
            break;
        }
      });

      // are there any required and are they all set?
      this.completionText = null;
      if (this.fields.filter(f => f.Required).some(f => {
        if (!this.values[f.ID]) {
            return true;
          }
        this.completionText = "COMPLETE";
      })) {
        this.completionText = "INCOMPLETE";
      }
    }

    // Make sure someone is not
    // trying to modify an old event.
    const today = new Date(Date.now());
    const start = (this.event) ? new Date(this.event.StartDate) : today;
    if (start < today) {
      this.canEdit = CommonService.canEditEvent(this.currentUser, this.event, Role.Support);
    } else {
      this.canEdit = CommonService.canEditProfile(
        this.currentUser,
        (this.attendee) ? this.attendee.Profile : null,
        this.event,
        Role.Lead | Role.Support | Role.Travel
      );
    }

  }

  popupEditFields() {
    const modalOptions: NgbModalOptions = {
      size: "lg",
      backdrop: "static"
    };

    const popupModalRef = this.modal.open(AttendeeFieldsPopupComponent, modalOptions);
    popupModalRef.componentInstance.title = "Edit " + (this.title ? this.title : "");
    popupModalRef.componentInstance.filter = this.filter;
    popupModalRef.componentInstance.event = this.event;

    var attendee: { [key: number]: EventAttendee; } = {}
    attendee[this.attendee.ID] = this.attendee;
    popupModalRef.componentInstance.attendees = attendee;

    popupModalRef.componentInstance.saveClicked.subscribe(attendee => {
      this.attendeeChange.emit(attendee);
      this.attendee = attendee;
      popupModalRef.close();
    });
  }

  @Input()
  get attendee(): EventAttendee {
    return this._attendee;
  }
  set attendee(attendee: EventAttendee) {
    this._attendee = attendee;
    this.onInputsChanged();
  }

  @Input()
  set filter(role: Role) {
    this._filter = role;
  }
  get filter(): Role {
    return this._filter;
  }

  @Input()
  set event(event: EventInfo) {
    this._event = event;
    this.onInputsChanged();
  }
  get event(): EventInfo {
    return this._event;
  }

  get fields(): Array<EventField> {
    return this._fields;
  }
}
