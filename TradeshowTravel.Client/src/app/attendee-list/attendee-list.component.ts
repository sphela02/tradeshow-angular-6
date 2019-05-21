import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { TradeshowService } from '../tradeshow.service';
import { SortDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { QueryParams, SortParams, FilterParams } from '../shared/QueryParams';

const flatten = filter => {
  const filters = (filter || {}).filters;
  if (filters) {
      return filters.reduce((acc, curr) => acc.concat(curr.filters ? flatten(curr) : [curr]), []);
  }
  return [];
};

@Component({
  selector: 'app-attendee-list',
  templateUrl: './attendee-list.component.html',
  styleUrls: ['./attendee-list.component.scss']
})
export class AttendeeListComponent implements OnInit {
  @ViewChild("attendeeGrid") grid: GridComponent

  segments: any[] = [];
  view: GridDataResult;
  state: DataStateChangeEvent;

  constructor(
    private service: TradeshowService
  ) {
    this.state = this.service.attendeeListState;
   }

  ngOnInit() {
    this.service.getSegments()
      .subscribe(segments => {
        this.segments = segments;
      });

    this.dataStateChange(this.state);
  }

  sortChange(sort: SortDescriptor[]) {
    this.state.sort = sort;
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.service.attendeeListState = state;
    this.loadAttendees();
  }
  
  private loadAttendees() {
    this.grid.loading = true;
    const params: QueryParams = <QueryParams> {
      Skip: this.state.skip,
      Size: this.state.take,
      Sort: this.state.sort.map(s => {
        return <SortParams> {
          Field: s.field,
          Desc: s.dir == "desc"
        }
      }),
      Filters: flatten(this.state.filter).map(filter => {
        var fd = filter as FilterDescriptor;
        return <FilterParams> {
          Field: fd.field,
          Operator: fd.operator,
          Value: fd.value
        }
      })
    };
    this.service.getAttendees(params)
      .subscribe(results => {
        this.view = {
          data: results.Attendees,
          total: results.Total
        };
        this.grid.loading = false;
      }, error => {
        this.grid.loading = false;
      })
  }
}
