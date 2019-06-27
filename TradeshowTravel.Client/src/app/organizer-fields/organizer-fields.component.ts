import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
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

    private organizerFilter: OrganizerFieldsFilterPipe = new OrganizerFieldsFilterPipe();

    @ViewChild("selectOrganizerFields") organizerFields: GridComponent;

    public filter: CompositeFilterDescriptor;
    public state: DataStateChangeEvent;
    public gridView: GridDataResult;

    public distinctFieldTypes: any[] = [];
    public checkedOrganizerFields: { [key: number]: EventField; } = {};
    public areAllChecked: boolean;
    public HelperSvc: typeof CommonService = CommonService;

    public constructor() {
        this.state = <DataStateChangeEvent>{
            filter: { logic: 'and', filters: [] },
            sort: []
        };
  }

  @Output() checkboxChange: EventEmitter<any> = new EventEmitter();

    @Input()
    public set event(event: EventInfo) {
        this._event = event;
        this.onInputsChanged();
    }

    public get event(): EventInfo {
        return this._event;
   }

    public get hasRecords(): boolean {
        return this.event && this.event.Fields && this.event.Fields.length > 0;
    }

    onClearOrganizerFieldChecked() {
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

      this.checkboxChange.emit(this.checkedOrganizerFields);
    }

    public onCheckAllOrganizerFields(event) {
        if (event.target.checked) {
            this.gridView.data.forEach(a => {
                if (!this.checkedOrganizerFields[a.ID]) {
                    this.checkedOrganizerFields[a.ID] = a;
                }
            });
        } else {
            this.gridView.data.forEach(a => {
                if (this.checkedOrganizerFields[a.ID]) {
                    delete this.checkedOrganizerFields[a.ID];
                }
            });
      }

      this.checkboxChange.emit(this.checkedOrganizerFields);
    }

    public dataStateChange(state: DataStateChangeEvent) {
        this.state = state;
        this.gridView = process(this.event.Fields, this.state);
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
            data: this.organizerFilter.transform(this.event.Fields),
            total: this.event.Fields.length
        };

        distinct(this.event.Fields).forEach((value) => {
            this.distinctFieldTypes.push({ Input: value.Input, InputType: this.HelperSvc.getInputTypeString(value.Input) });
        });
    }
}
