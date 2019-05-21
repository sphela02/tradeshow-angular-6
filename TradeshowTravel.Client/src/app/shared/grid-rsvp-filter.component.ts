import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'grid-rsvp-filter',
  template: `
    <div>
      <input type="checkbox" id="cbYes" class="filled-in" [checked]="isYesChecked" (click)="onYesClicked($event)" />
      <label for="cbYes">Yes</label>
    </div>
    <div>
      <input type="checkbox" id="cbNo" class="filled-in" [checked]="isNoChecked" (click)="onNoClicked($event)" />
      <label for="cbNo">No</label>
    </div>
    <div>
      <input type="checkbox" id="cbNone" class="filled-in" [checked]="isNoneChecked" (click)="onNoneClicked($event)" />
      <label for="cbNone">No Response</label>
    </div>
  `,
  styles: []
})
export class GridRsvpFilterComponent implements AfterViewInit {
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
      this.values.push("Accepted");
    } else if (!event.target.checed && this.isYesChecked) {
      this.values = this.values.filter(x => x !== "Accepted");
    }
    this.onInputsChanged();
  }
  onNoClicked(event) {
    if (event.target.checked && !this.isNoChecked) {
      this.values.push("Declined");
    } else if (!event.target.checed && this.isNoChecked) {
      this.values = this.values.filter(x => x !== "Declined");
    }
    this.onInputsChanged();
  }
  onNoneClicked(event) {
    if (event.target.checked && !this.isNoneChecked) {
      this.values.push("Pending");
      this.values.push("Invited");
    } else if (!event.target.checed && this.isNoneChecked) {
      this.values = this.values.filter(x => x !== "Pending" && x !== "Invited");
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
    return this.values.some(i => i == "Accepted");
  }
  get isNoChecked() {
    return this.values.some(i => i == "Declined");
  }
  get isNoneChecked() {
    return this.values.some(i => i == "Pending") && 
           this.values.some(i => i == "Invited");
  }
}
