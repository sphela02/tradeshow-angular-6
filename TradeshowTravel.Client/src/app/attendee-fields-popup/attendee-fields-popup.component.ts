import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventAttendee } from '../shared/EventAttendee';
import { EventField, EventInfo } from '../shared/EventInfo';
import { Role, InputType } from '../shared/Enums';
import { TradeshowService } from '../tradeshow.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-attendee-fields-popup',
  templateUrl: './attendee-fields-popup.component.html',
  styleUrls: ['./attendee-fields-popup.component.scss']
})
export class AttendeeFieldsPopupComponent implements OnInit {
  @Output() saveClicked: EventEmitter<EventAttendee> = new EventEmitter<EventAttendee>();
  @Input() title: string;

  InputType: typeof InputType = InputType;

  private _filter: Role = Role.None;
  private _event: EventInfo;
  private _attendees: EventAttendee[];
  private _fields: Array<EventField>;
  
  maxvalues: { [key: number]: any } = {};
  minvalues: { [key: number]: any } = {};
  values: { [key: number]: any } = {};
  showRequired: boolean = false;
  isLoading: boolean = false;
  errorMsg: string;

  constructor(
    private service: TradeshowService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
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

    // Load initial values
    if (this.fields && this.attendees && this.attendees.length > 0) {
      var firstAttendee = this.attendees[0];

      this.fields.forEach(f => {
        this.showRequired = f.Required ? true : this.showRequired;
        switch (f.Input) {
          case InputType.LongText:
          case InputType.ShortText:
          case InputType.Select:
            if (f.Source) {
              this.values[f.ID] = firstAttendee[f.Source];
            } else {
              this.values[f.ID] = firstAttendee.Properties[f.ID];
            }
            break;
          case InputType.Date:
            var dt = null;
            if (f.Source && firstAttendee[f.Source]) {
              dt = new Date(firstAttendee[f.Source]);
            }
            else if (!f.Source && firstAttendee.Properties[f.ID]) {
              dt = new Date(firstAttendee.Properties[f.ID])
            }
            if (f.Source == "Arrival") {
              this.maxvalues[f.ID] = new Date(this.event.EndDate);
            }
            if (f.Source == "Departure") {
              this.minvalues[f.ID] = new Date(this.event.StartDate);
            }
            this.values[f.ID] = dt;
            break;
          case InputType.YesOrNo:
            if (f.Source) {
              this.values[f.ID] = CommonService.getYesOrNoText(firstAttendee[f.Source]);
            } else {
              this.values[f.ID] = CommonService.getYesOrNoText(firstAttendee.Properties[f.ID]);
            }
            break;
          case InputType.MultiSelect:
            var list = [];
            if (f.Source && firstAttendee[f.Source]) {
              list = firstAttendee[f.Source].split('|');
            }
            else if (!f.Source && firstAttendee.Properties[f.ID]) {
              list = firstAttendee.Properties[f.ID].split('|');
            }
            this.values[f.ID] = list;
            break;
        }
      });
    }
  }

  @Input()
  set attendees(attendee: EventAttendee[]) {
    this._attendees = attendee;
    this.onInputsChanged();
  }
  get attendees(): EventAttendee[] {
    return this._attendees;
  }

  @Input()
  set filter(role: Role) {
    this._filter = role;
    this.onInputsChanged();
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

  cancelPopup() {
    this.activeModal.close();
  }

  onSubmit() {
    alert(this.attendees.length);
    if (!this.attendees || !this.fields) {
      return;
    }
    for (var i = 0; i < this.attendees.length; i++) {
      let attendee: EventAttendee = Object.assign({}, this.attendees[i]);
      this.fields.forEach(f => {
        let value: any = null;
        if (f.Input == InputType.MultiSelect) {
          if (this.values[f.ID]) {
            value = this.values[f.ID].join('|');
          }
        } else {
          value = this.values[f.ID];
        }
        if (f.Source) {
          attendee[f.Source] = value;
        } else {
          attendee.Properties[f.ID] = (value) ? value : "";
        }
      });

      // Check if the user is attending and ensure
      // all required fields are entered if so
      if (CommonService.getYesOrNoText(attendee.IsAttending) == "Yes") {
        let hasError: boolean = false;
        this.fields.forEach(f => {
          if (f.Included && f.Required && !this.values[f.ID]) {
            hasError = true;
            this.errorMsg = "The field '" + f.Label + "' is required.";
            return false;
          }
        });
        if (hasError) {
          return;
        }
      }

      this.errorMsg = null;
      this.isLoading = true;
      this.service.saveAttendee(this.event.ID, attendee)
        .subscribe(attendee => {
          this.isLoading = false;
          this.saveClicked.emit(attendee);
        }, error => {
          this.isLoading = false;
          this.errorMsg = error;
        });
    }
  }

}
