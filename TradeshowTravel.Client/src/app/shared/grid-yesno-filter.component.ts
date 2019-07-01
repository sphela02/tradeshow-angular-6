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
    <div *ngIf="isNoResponseAllowed">
      <input type="checkbox" id="cbNone" class="filled-in" [checked]="isNoneChecked" (click)="onNoneClicked($event)" />
      <label for="cbNone">No Response</label>
    </div>
  `,
  styles: []
})
export class GridYesNoFilterComponent implements AfterViewInit {
  @Input() public currentFilter: CompositeFilterDescriptor;
  @Input() public filterService: FilterService;
  @Input() public field: string;
  @Input() public isBooleanField: boolean;
  @Input() public isNoResponseAllowed: boolean;

  @Output() public valueChange = new EventEmitter<number[]>();
  
  private values: Array<string> = [];

  constructor() { }

  ngAfterViewInit() {
    this.values = this.currentFilter.filters.map(f => (f as FilterDescriptor).value);
  }

  onYesClicked(event) {
    if (event.target.checked && !this.isYesChecked) {     
      this.values.push(this.getFormatedResponse(true));
    } else if (!event.target.checed && this.isYesChecked) {
      this.values = this.values.filter(x => x !== this.getFormatedResponse(true));
    }
    this.onInputsChanged();
  }
  onNoClicked(event) {
    if (event.target.checked && !this.isNoChecked) {
      this.values.push(this.getFormatedResponse(false));
    } else if (!event.target.checked && this.isNoChecked) {
      this.values = this.values.filter(x => x !== this.getFormatedResponse(false));
    }
    this.onInputsChanged();
  }
  onNoneClicked(event) {
    if (event.target.checked && !this.isNoneChecked) {
      this.values.push("null");
    } else if (!event.target.checed && this.isNoneChecked) {
      this.values = this.values.filter(x => x !== "null");
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

  private getFormatedResponse(aResponse: boolean) {
    return this.isBooleanField
      ? this.getBooleanResponse(aResponse)
    : this.getStringResponse(aResponse);
  }

  private getBooleanResponse(aResponse: boolean) {
    if (aResponse) {
      return '1';
    }
    else {
      return '0';
    }
  }

  private getStringResponse(aResponse: boolean) {
    if (aResponse) {
      return 'Yes';
    }
    else {
      return 'No';
    }
  }

  get isYesChecked() {
    return this.values.some(i => i == this.getFormatedResponse(true));
  }
  get isNoChecked() {
    return this.values.some(i => i == this.getFormatedResponse(false));
  }
  get isNoneChecked() {
    return this.values.some(i => i == "null");
  }
}
