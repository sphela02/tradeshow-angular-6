import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CompositeFilterDescriptor, distinct, filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService } from '@progress/kendo-angular-grid';


@Component({
  selector: 'grid-seg-filter',
  template: `
  <ul>
    <li *ngIf="showFilter">
      <input class="k-textbox" (input)="onInput($event)" />
    </li>
    <li
      *ngFor="let item of currentData; let i = index;"
      (click)="onSelectionChange(valueAccessor(item))"
      [ngClass]="{'k-state-selected': isItemSelected(item)}">
      <input
        type="checkbox"
        id="chk-{{valueAccessor(item)}}"
        class="k-checkbox"
        [checked]="isItemSelected(item)" />
      <label
        class="k-multiselect-checkbox k-checkbox-label"
        for="chk-{{valueAccessor(item)}}">
          {{ textAccessor(item) }}
      </label>
    </li>
  </ul>
  `,
  styles: [`
    ul {
      list-style-type: none;
      height: 200px;
      overflow-y: scroll;
      padding-left: 0;
      padding-right: 12px;
    }

    ul>li {
      padding: 8px 12px;
      border: 1px solid rgba(0,0,0,.08);
      border-bottom: none;
    }

    ul>li:last-of-type {
      border-bottom: 1px solid rgba(0,0,0,.08);
    }

    .k-multiselect-checkbox {
      pointer-events: none;
    }
  `]
})
export class GridSegFilterComponent implements AfterViewInit {
  @Input() public isPrimitive: boolean;
  @Input() public currentFilter: CompositeFilterDescriptor;
  @Input() public data;
  @Input() public textField;
  @Input() public valueField;
  @Input() public filterService: FilterService;
  @Input() public field: string;
  @Input() public operator: string;
  @Input() public showFilter: boolean = true;
  @Output() public valueChange = new EventEmitter<number[]>();

  public currentData: any;
  private value: any[] = [];

  protected textAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.textField];
  protected valueAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.valueField];

  public ngAfterViewInit() {
    this.currentData = this.data;
    this.value = this.currentFilter.filters.map(f => (f as FilterDescriptor).value);
    if (!this.operator) {
      this.operator = "contains";
    }
    //this.showFilter = typeof this.textAccessor(this.currentData[0]) === 'string';
  }

  public isItemSelected(item) {
    return this.value.some(x => x === this.valueAccessor(item));
  }

  public onSelectionChange(item) {
    if (this.value.some(x => x === item)) {
      this.value = this.value.filter(x => x !== item);
    } else {
      this.value.push(item);
    }

    this.filterService.filter({
        filters: this.value.map(value => ({
            field: this.field,
            operator: this.operator,
            value
        })),
        logic: 'or'
    });
  }

  public onInput(e: any) {
    this.currentData = distinct([
      ...this.currentData.filter(dataItem => this.value.some(val => val === this.valueAccessor(dataItem))),
      ...filterBy(this.data, {
        operator: this.operator,
        field: this.textField,
        value: e.target.value
      })],
      this.textField
      );
  }
}
