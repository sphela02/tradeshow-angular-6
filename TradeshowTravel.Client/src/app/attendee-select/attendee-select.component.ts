import { Component, Input, Output, EventEmitter } from "@angular/core";
import { EventAttendee } from "../shared/EventAttendee";
import { GridDataResult, DataStateChangeEvent, PagerSettings, PageChangeEvent } from "@progress/kendo-angular-grid";
import { CommonService } from "../common.service";
import { process, FilterDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: "app-attendee-select",
    templateUrl: './attendee-select.component.html',
})
export class AttendeeSelectComponent {
    private _attendees: EventAttendee[];

    public state: DataStateChangeEvent;
    public pageSettings: PagerSettings;
    public gridView: GridDataResult;
    public areAllChecked: boolean;
    public checkedAttendeeFields: { [key: number]: EventAttendee; } = {};

    public HelperSvc: typeof CommonService = CommonService;
    public pageSize = 5;
    public skip = 0;

    public constructor() {
        this.state = <DataStateChangeEvent>{
            filter: { logic: 'and', filters: [] },
            sort: []
        };

        this.pageSettings = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: false,
            previousNext: true
        };
    }

    @Output() attendeeChecked: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    public set attendees(eventAttendees: EventAttendee[]) {
        this._attendees = eventAttendees;
        this.onInputsChanged();
    }

    public get attendees() {
        return this._attendees;
    }

    protected pageChange({ skip, take }: PageChangeEvent): void {
        this.skip = skip;
        this.pageSize = take;
    }

    public get hasRecords(): boolean {
        return this._attendees && this._attendees.length > 0;
    }

    public onAttendeeFieldChecked(eventField: EventAttendee) {
        if (eventField) {
            if (this.checkedAttendeeFields[eventField.ID]) {
                delete this.checkedAttendeeFields[eventField.ID];
            } else {
                this.checkedAttendeeFields[eventField.ID] = eventField;
            }
      }

      this.attendeeChecked.emit(this.checkedAttendeeFields);
    }

    public onCheckAllAttendeeFields(event) {
        if (event.target.checked) {
            this._attendees.forEach(a => {
                if (!this.checkedAttendeeFields[a.ID]) {
                    this.checkedAttendeeFields[a.ID] = a;
                }
            });
        } else {
            this._attendees.forEach(a => {
                if (this.checkedAttendeeFields[a.ID]) {
                    delete this.checkedAttendeeFields[a.ID];
                }
            });
      }

      this.attendeeChecked.emit(this.checkedAttendeeFields);
    }

    public dataStateChange(state: DataStateChangeEvent) {
        this.state = state;
        this.gridView = process(this._attendees, this.state);
    }

    public filterChange(filter: FilterDescriptor[]) {
        this.onClearAttendeeChecked();
    }

    private onClearAttendeeChecked() {
        this.checkedAttendeeFields = {};
    }

    private onInputsChanged() {
        if (this._attendees) {
            this.gridView = {
                data: this._attendees,
                total: this._attendees.length
            };
        }
    }
}
