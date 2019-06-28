import { Component, Input, ViewChild, Output } from '@angular/core';
import { GridComponent, GridDataResult, DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { EventInfo, EventField } from '../shared/EventInfo';
import { OrganizerFieldsFilterPipe } from '../shared/pipes/organizer-fields-filter.pipe';
import { CommonService } from '../common.service';
import { process, CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

const distinct = (data: EventField[]) => data
    .filter((x, idx, xs) => xs.findIndex(y => y.Input === x.Input) === idx);

@Component({
    selector: "app-organizer-fields",
    templateUrl: './organizer-fields.component.html',
})
export class OrganizerFieldsComponent {
    private _event: EventInfo;
    private _organizerFields: EventField[];

    private organizerFilter: OrganizerFieldsFilterPipe = new OrganizerFieldsFilterPipe();

    @ViewChild("selectOrganizerFields") organizerFields: GridComponent;

    public filter: CompositeFilterDescriptor;
    public state: DataStateChangeEvent;
    public gridView: GridDataResult;

    public distinctFieldTypes: any[] = [];

    @Output()
    public checkedOrganizerFields: { [key: number]: EventField; } = {};
    public HelperSvc: typeof CommonService = CommonService;

    public constructor() {
        this.state = <DataStateChangeEvent>{
            filter: { logic: 'and', filters: [] },
            sort: []
        };
    }

    @Input()
    public set event(event: EventInfo) {
        this._event = event;
        this._organizerFields = this.organizerFilter.transform(this.event.Fields);
        this.onInputsChanged();
    }

    public get event() {
        return this._event;
    }

    public get areAllChecked(): boolean {
        if (!this.checkedOrganizerFields || !this._organizerFields) {
            return false;
        }

        return this._organizerFields.every((organizerField) => organizerField.ID in this.checkedOrganizerFields);
    }

    public get hasRecords(): boolean {
        return this._organizerFields && this._organizerFields.length > 0;
    }

    public onClearOrganizerFieldChecked() {
        this.checkedOrganizerFields = {};
    }

    public onOrganizerFieldChecked(eventField: EventField) {
        if (eventField) {
            if (this.checkedOrganizerFields[eventField.ID]) {
                delete this.checkedOrganizerFields[eventField.ID];
            } else {
                this.checkedOrganizerFields[eventField.ID] = eventField;
            }
        }
    }

    public onCheckAllOrganizerFields(event) {
        if (event.target.checked) {
            this._organizerFields.forEach(a => {
                if (!this.checkedOrganizerFields[a.ID]) {
                    this.checkedOrganizerFields[a.ID] = a;
                }
            });
        } else {
            this._organizerFields.forEach(a => {
                if (this.checkedOrganizerFields[a.ID]) {
                    delete this.checkedOrganizerFields[a.ID];
                }
            });
        }
    }

    public dataStateChange(state: DataStateChangeEvent) {
        this.state = state;
        this.gridView = process(this._organizerFields, this.state);
        this.onClearOrganizerFieldChecked();
    }

    public sortChange(sort: SortDescriptor[]): void {
        sort.map((item) => {
            if (item.field === "Input" && item.dir) {
                var data = this.gridView.data.sort((a, b) => {
                    var inputFieldString1 = this.HelperSvc.getInputTypeString(a.Input);
                    var inputFieldString2 = this.HelperSvc.getInputTypeString(b.Input);

                    if (inputFieldString1 < inputFieldString2) {
                        return -1;
                    } else if (inputFieldString1 > inputFieldString2) {
                        return 1;
                    }

                    return 0;
                });

                if (item.dir === "desc") {
                    data = data.reverse();
                }

                this.gridView.data = data;
                this.state.sort["dir"] = item.dir;
            }
        });
    }

    private onInputsChanged() {
        this.gridView = {
            data: this._organizerFields,
            total: this._organizerFields.length
        };

        distinct(this._organizerFields).forEach((value) => {
            this.distinctFieldTypes.push({ Input: value.Input, InputType: this.HelperSvc.getInputTypeString(value.Input) });
        });
    }
}