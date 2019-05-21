import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventEditPopupComponent } from '../event-edit-popup/event-edit-popup.component';
import { addMonths, addDays, lastDayOfMonth } from '@progress/kendo-date-math';
import { TradeshowService } from '../tradeshow.service';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { QueryParams, SortParams, FilterParams } from '../shared/QueryParams';
import { EventQueryResult } from '../shared/EventQuery';
import { SortDescriptor, FilterDescriptor, CompositeFilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { Permissions } from '../shared/Enums';

const flatten = filter => {
  const filters = (filter || {}).filters;
  if (filters) {
      return filters.reduce((acc, curr) => acc.concat(curr.filters ? flatten(curr) : [curr]), []);
  }
  return [];
};


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @ViewChild("eventsGrid") grid: GridComponent;
  view: GridDataResult;
  state: DataStateChangeEvent;
  results: EventQueryResult;
  startDate: Date;
  endDate: Date;
  segments: any[] = [];
  showAddEvent: boolean;

  constructor(
    private router: Router,
    private modal: NgbModal,
    private service: TradeshowService
  ) {
    // init grid state
    this.state = this.service.eventListState;
    // init query results
    this.results = <EventQueryResult> {
      Upcoming: 0,
      Past: 0,
      Total: 0
    };
  }

  ngOnInit() {

    this.state.filter.filters.forEach(filter => {
      let cfd = filter as CompositeFilterDescriptor;
      cfd.filters.forEach(f => {
        let fd = f as FilterDescriptor;
        if (fd && fd.field == "StartDate") {
          if (fd.operator == "gt") {
            this.startDate = new Date(fd.value);
          } else if (fd.operator == "lt") {
            this.endDate = new Date(fd.value);
          }
        }
      });
    });

    this.service.getSegments()
      .subscribe(segments => {
        this.segments = segments;
        let segs = { };
        segments.forEach(segment => {
          segs[segment] = 0;
        });
        this.results.Segments = segs;
      });

    this.service.getMyProfile().subscribe(me => {
      this.showAddEvent = (
        Permissions.CreateShows == (me.Privileges & Permissions.CreateShows)
      );
    });

    this.dataStateChange(this.state);
  }

  private loadEvents() {
    this.grid.loading = true;
    // convert to service params
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
    this.service.getEvents(params)
      .subscribe(results => {
        this.results = results;
        this.view = {
          data: results.Events,
          total: results.Total
        };
        this.grid.loading = false;
      }, error => {
        // show error message.
        this.grid.loading = false;
      });
  }

  dateRangeChange() {
    this.dataStateChange(this.state);
  }

  sortChange(sort: SortDescriptor[]) {
    this.state.sort = sort;
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.service.eventListState = state;
    this.loadEvents();
  }

  onStartChange(value: Date) {
    var filter = this.state.filter.filters[0] as CompositeFilterDescriptor;
    if (filter) {
      var fd = filter.filters[0] as FilterDescriptor;
      fd.value = value;
    }
    if (value > this.endDate) {
      this.endDate = value;
      this.onEndChange(value);
    }
  }
  onEndChange(value: Date) {
    var filter = this.state.filter.filters[0] as CompositeFilterDescriptor;
    if (filter) {
      var fd = filter.filters[1] as FilterDescriptor;
      fd.value = value;
    }
    if (value < this.startDate) {
      this.startDate = value;
      this.onStartChange(value);
    }
  }

  popupNewEvent() {
    const modalOptions: NgbModalOptions = {
      size: "lg",
      // beforeDismiss: function() {
      //   return false;
      // }
      backdrop: "static"
    };

    const popupModalRef = this.modal.open(EventEditPopupComponent, modalOptions);
    popupModalRef.componentInstance.eventToEdit = null;
    popupModalRef.componentInstance.saveClicked.subscribe(event => {
      this.dataStateChange(this.state);
    });
  }
}
