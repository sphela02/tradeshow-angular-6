import { Component, Input } from '@angular/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { FilterService, BaseFilterCellComponent } from '@progress/kendo-angular-grid';

@Component({
    selector: 'grid-field-type-filter',
    template: `
    <kendo-dropdownlist
      [data]="data"
      (valueChange)="onChange($event)"  
      [defaultItem]="defaultItem"  
      [value]="selectedValue"
      [valuePrimitive]="true"
      [textField]="textField"
      [valueField]="valueField">
    </kendo-dropdownlist>
  `
})
export class GridFieldTypeFilterComponent extends BaseFilterCellComponent {

    public get selectedValue(): any {
        const filter = this.filterByField(this.valueField);
        return filter ? filter.value : null;
    }

    @Input() public data: any[];
    @Input() public filter: CompositeFilterDescriptor;
    @Input() public textField: string;
    @Input() public valueField: string;

    public get defaultItem(): any {
        return {
            [this.textField]: 'Select item...',
            [this.valueField]: null
        };
    }

    constructor(filterService: FilterService) {
        super(filterService);
    }

    public onChange(value: any): void {
        this.applyFilter(
            value === null ? 
                this.removeFilter(this.valueField) : 
                this.updateFilter({ 
                    field: this.valueField,
                    operator: 'eq',
                    value: value
                })
        ); 
    }
}
