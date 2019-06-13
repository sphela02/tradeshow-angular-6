import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'grid-yesno-filter',
  template: `
    <div>
      <input type="checkbox" id="cbYes" class="filled-in" [checked]="isYesChecked" (click)="onYesClicked($event)" />
      <label for="cbYes">Yes</label>
    </div>
    <div>
      <input type="checkbox" id="cbNo" class="filled-in" [checked]="isNoChecked" (click)="onNoClicked($event)" />
      <label for="cbNo">No</label>
    </div>
  `,
  styles: []
})
export class GridYesNoFilterComponent implements AfterViewInit {
  @Input() public currentFilter: CompositeFilterDescriptor;
  @Input() public filterService: FilterService;
  @Input() public field: string;

  @Output() public valueChange = new EventEmitter<number[]>();
  
  private values: Array<string> = [];

  constructor() { }

  ngAfterViewInit() {
    this.values = this.currentFilter.filters.map(f => (f as FilterDescriptor).value);
  }

  onYesClicked(event) {
    if (event.target.checked && !this.isYesChecked) {
      this.values.push("Yes");
    } else if (!event.target.checed && this.isYesChecked) {
      this.values = this.values.filter(x => x !== "Yes");
    }
    this.onInputsChanged();
  }
  onNoClicked(event) {
    if (event.target.checked && !this.isNoChecked) {
      this.values.push("No");
    } else if (!event.target.checked && this.isNoChecked) {
      this.values = this.values.filter(x => x !== "No");
    }
    this.onInputsChanged();
  }

  private onInputsChanged() {
    this.filterService.filter({
      filters: this.values.map(value => ({
          field: this.field,
          operator: "eq",
          value
      })),
      logic: 'or'
  });
  }

  get isYesChecked() {
    return this.values.some(i => i == "Yes");
  }
  get isNoChecked() {
    return this.values.some(i => i == "No");
  }
}
