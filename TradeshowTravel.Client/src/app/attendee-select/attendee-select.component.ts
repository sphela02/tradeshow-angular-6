import { Component, Input, ViewChild, Output } from "@angular/core";
import { EventAttendee } from "../shared/EventAttendee";
import { GridDataResult, DataStateChangeEvent, PagerSettings, PageChangeEvent, GridComponent } from "@progress/kendo-angular-grid";
import { CommonService } from "../common.service";
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { QueryParams } from "../shared/QueryParams";
import { TradeshowService } from "../tradeshow.service";

@Component({
    selector: "app-attendee-select",
    templateUrl: './attendee-select.component.html',
})
export class AttendeeSelectComponent {
    @ViewChild("selectAttendees") grid: GridComponent;

    private _eventID: number;
    private _attendees: EventAttendee[];
    public filter: CompositeFilterDescriptor;
    public state: DataStateChangeEvent;
    public pageSettings: PagerSettings;
    public gridView: GridDataResult;

    @Output()
    public checkedAttendeeFields: { [key: number]: EventAttendee; } = {};

    public HelperSvc: typeof CommonService = CommonService;

    public constructor(private service: TradeshowService) {
        this.state = <DataStateChangeEvent>{
            skip: 0,
            take: 25,
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

    public loadAttendees() {
        this.grid.loading = true;
        const params: QueryParams = CommonService.convertToServiceQueryParams(this.state);
        this.service.getEventAttendees(this._eventID, params)
            .subscribe(results => {
                this.gridView = {
                    data: results.Attendees,
                    total: results.Total
                };
                this._attendees = results.Attendees;
                this.grid.loading = false;
            }, () => {
                // show error message.
                this.grid.loading = false;
            });
    }

    public get areAllChecked(): boolean {
        if (!this.checkedAttendeeFields || !this._attendees) {
            return false;
        }

        return this._attendees.every((attendee) => attendee.ID in this.checkedAttendeeFields);
    }

    @Input()
    public set eventID(eventID: number) {
        this._eventID = eventID;
        this.loadAttendees();
    }

    public get eventID() {
        return this._eventID;
    }

    public pageChange({ skip, take }: PageChangeEvent): void {
        this.state.skip = skip;
        this.state.take = take;
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
    }

    public dataStateChange(state: DataStateChangeEvent) {
        this.state = state;
        this.loadAttendees();
    }

    public filterChange($event) {
        this.onClearAttendeeChecked();
    }

    private onClearAttendeeChecked() {
        this.checkedAttendeeFields = {};
    }
}