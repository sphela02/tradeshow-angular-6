import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { EventInfo, EventField } from '../shared/EventInfo';
import { Router } from '@angular/router';
import { PageTitleService } from '../pagetitle.service';
import { SideMenuMode, EventDisplayTab } from '../shared/shared';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventEditPopupComponent } from '../event-edit-popup/event-edit-popup.component';
import { Role, InputType, ShowType, Permissions } from '../shared/Enums';
import { UserInfo } from '../shared/UserInfo';
import { EventDeletePopupComponent } from '../event-delete-popup/event-delete-popup.component';
import { TradeshowService } from '../tradeshow.service';
import { EventUsersPopupComponent } from '../event-users-popup/event-users-popup.component';
import { GridComponent, DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { EventFieldPopupComponent } from '../event-field-popup/event-field-popup.component';
import { CommonService } from '../common.service';
import { AttendeeFieldsFilterPipe } from '../shared/pipes/attendee-fields-filter.pipe';
import { OrganizerFieldsFilterPipe } from '../shared/pipes/organizer-fields-filter.pipe';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';
import { AddAttendeePopupComponent } from '../add-attendee-popup/add-attendee-popup.component';
import { EventAttendeeQueryResult } from '../shared/EventAttendeeQuery';
import { QueryParams, SortParams, FilterParams } from '../shared/QueryParams';
import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { UserProfile } from '../shared/UserProfile';
import { EventAttendee } from '../shared/EventAttendee';
import { ProfileEditPopupComponent } from '../profile-edit-popup/profile-edit-popup.component';
import { AttendeeFieldsPopupComponent } from '../attendee-fields-popup/attendee-fields-popup.component';
import { AttendeeDeletePopupComponent } from '../attendee-delete-popup/attendee-delete-popup.component';
import { SendRsvpPopupComponent } from '../send-rsvp-popup/send-rsvp-popup.component';
import { SendReminderPopupComponent } from '../send-reminder-popup/send-reminder-popup.component';
import { AttendeeStatus } from '../shared/Enums';

declare var $: any;

const flatten = filter => {
  const filters = (filter || {}).filters;
  if (filters) {
      return filters.reduce((acc, curr) => acc.concat(curr.filters ? flatten(curr) : [curr]), []);
  }
  return [];
};

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {
  @ViewChild("attendeeGrid") grid: GridComponent;
  @ViewChild("attendeeFields") attendeeFields: GridComponent;
  @ViewChild("organizerFields") organizerFields: GridComponent;
  currentUser: UserProfile;
  results: EventAttendeeQueryResult;
  view: GridDataResult;
  state: DataStateChangeEvent;
  segments: any[] = [];
  EventDisplayTab: typeof EventDisplayTab = EventDisplayTab;
  activeTab: EventDisplayTab = EventDisplayTab.Details;
  ShowType: typeof ShowType = ShowType;
  Role: typeof Role = Role;
  InputType: typeof InputType = InputType;
  HelperSvc: typeof CommonService = CommonService;
  showAllInfo: boolean = false;
  isFieldsDirty: boolean = false;
  canEditAttendees: boolean = false;
  canEditSettings: boolean = false;
  canAddAttendee: boolean = false;
  canDeleteAttendee: boolean = false;
  canEditProfiles: boolean = false;
  canViewPassportInfo: boolean = false;
  checkedAttendees: { [key: number]: EventAttendee; } = {};

  private _event: EventInfo;
  private _attendee: EventAttendee;
  private attendeeFilter: AttendeeFieldsFilterPipe = new AttendeeFieldsFilterPipe();
  private organizerFilter: OrganizerFieldsFilterPipe = new OrganizerFieldsFilterPipe();

  constructor(
    private modal: NgbModal,
    private pagetitle: PageTitleService,
    private router: Router,
    private service: TradeshowService
  ) {
    // init grid state
    this.state = <DataStateChangeEvent> {
      skip: 0,
      take: 25,
      filter: { logic: 'and', filters: [] },
      sort: [{ field: 'Name', dir: 'asc' }]
    };
    // init query results
    this.results = <EventAttendeeQueryResult> { Total: 0, Hotel: 0, RSVPD: 0, Completed: 0, Attendees: [] };
   }

   ngOnInit() {
    if (!this.event) {
      this.router.navigate(['events']);
    }

    this.service.getMyProfile().subscribe(me => {
      this.currentUser = me;
      this.onInputsChanged();
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

    if (!this.event.Fields) {
      this.event.Fields = [];
    }

    this.dataStateChange(this.state);

    this.rebindFieldTables(null);
  }

  private onInputsChanged() {
    if (this.event) {
      setTimeout(() => {
        this.pagetitle.setActivePage(SideMenuMode.Events, this.event.Name)
      });
    }
    this.canEditAttendees = CommonService.canEditEvent(
      this.currentUser, this.event
    );
    this.canEditSettings = CommonService.canEditEvent(
      this.currentUser, this.event, Role.Lead
    );
    this.canAddAttendee = CommonService.canEditEvent(
      this.currentUser, this.event, Role.Lead | Role.Support | Role.Business
    );
    this.canDeleteAttendee = CommonService.canEditEvent(
      this.currentUser, this.event, Role.Lead | Role.Support | Role.Business
    );
    this.canEditProfiles = CommonService.canEditProfile(
      this.currentUser, null, this.event, Role.Lead | Role.Support
    );
    this.canViewPassportInfo = CommonService.canViewPassportInfo(
      this.currentUser, null, this.event
    );
  }

  @Input()
  set event(event: EventInfo) {
    this._event = event;
    this.onInputsChanged();
  }
  get event(): EventInfo {
    return this._event;
  }

  onTabClick(event) {
    this.activeTab = (<any>EventDisplayTab)[event.target.id];
  }

  onTabClose(event) {
    event.stopPropagation();
    this.selectedAttendee = null;
    if (this.activeTab == EventDisplayTab.Attendee) {
      this.activeTab = EventDisplayTab.Details;
    }
  }

  get selectedAttendee(): EventAttendee {
    return this._attendee;
  }
  set selectedAttendee(attendee: EventAttendee) {
    this._attendee = attendee;
  }

  toggleShowAll() {
    this.showAllInfo = !this.showAllInfo;
  }

  get daysUntilEvent(): number {
    const date = new Date(Date.now());
    const temp = new Date(this.event.StartDate);
    const ms = temp.getTime() - date.getTime();
    if (ms > 0) {
      return Math.floor(ms / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  get eventFields(): Array<EventField> {
    return this.event.Fields.filter(
      f => f.Included
    );
  }

  imgErrHandler(event) {
    event.target.className += " d-none";
    let dom = event.target.nextSibling.nextSibling;
    dom.className = dom.className.replace('d-none', '');
  }

  private getAttendeeQueryParams(): QueryParams {
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
    return params;
  }

  private loadAttendees() {
    this.grid.loading = true;
    const params: QueryParams = this.getAttendeeQueryParams();
    this.service.getEventAttendees(this.event.ID, params)
      .subscribe(results => {
        this.results = results;
        this.view = {
          data: results.Attendees,
          total: results.Total
        };
        this.grid.loading = false;
        this.loadAttendeeContextMenuFix();
      }, error => {
        // show error message.
        this.grid.loading = false;
      });
  }

  private loadAttendeeContextMenuFix() {
    window.setTimeout(function () {
      $('.attendee-edit-dropdown').on('show.bs.dropdown', function(event){
        let menuId : string = "#att_menu_" + event.target.dataset.id;
        $('body').append($(menuId).css({
          position: 'absolute'
        }).detach());
      });
    }, 50);
  }

  sortChange(sort: SortDescriptor[]) {
    this.state.sort = sort;
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.loadAttendees();
  }

  get checkedAttendeeCount(): number {
    return Object.keys(this.checkedAttendees).length;
  }

  get areAllChecked(): boolean {
    if (!this.results ||
        !this.results.Attendees ||
        !this.results.Attendees.length) {
      return false;
    }
    if (this.results.Attendees.some(a => {
      if (!this.checkedAttendees[a.ID]) {
        return true;
      }
    })) {
      return false;
    } else {
      return true;
    }
  }

  onCheckAllAttendees(event) {
    if (event.target.checked) {
      this.results.Attendees.forEach(a => {
        if (!this.checkedAttendees[a.ID]) {
          this.checkedAttendees[a.ID] = a;
        }
      });
    } else {
      this.results.Attendees.forEach(a => {
        if (this.checkedAttendees[a.ID]) {
          delete this.checkedAttendees[a.ID];
        }
      });
    }
  }

  onClearAttendeeChecked() {
    this.checkedAttendees = {};
  }

  onAttendeeChecked(attendee: EventAttendee) {
    if (attendee) {
      if (this.checkedAttendees[attendee.ID]) {
        delete this.checkedAttendees[attendee.ID];
      } else {
        this.checkedAttendees[attendee.ID] = attendee;
      }
    }
  }

  onAttendeeInfoClicked(attendee: EventAttendee) {
    if (attendee) {
      this.selectedAttendee = attendee;
      this.activeTab = EventDisplayTab.Attendee;
    }
  }

  onAttendeeChanged() {
    // refresh the attendee list
    this.dataStateChange(this.state);
  }

  popupSendRSVP() {
    const modalOptions: NgbModalOptions = {
      size: "lg",
      backdrop: "static"
    }

    const popupModalRef = this.modal.open(SendRsvpPopupComponent, modalOptions);
    popupModalRef.componentInstance.event = this.event;
    popupModalRef.componentInstance.attendees = this.checkedAttendees;
    popupModalRef.componentInstance.sendClicked.subscribe(() => {
      this.onClearAttendeeChecked();
      this.dataStateChange(this.state);
    });
  }

  popupSendReminder() {
    const modalOptions: NgbModalOptions = {
      size: "lg",
      backdrop: "static"
    }

    const popupModalRef = this.modal.open(SendReminderPopupComponent, modalOptions);
    popupModalRef.componentInstance.eventID = this.event.ID;
    popupModalRef.componentInstance.attendees = this.checkedAttendees;
    popupModalRef.componentInstance.sendClicked.subscribe(() => {
      this.onClearAttendeeChecked();
    });
  }

  popupDeleteAttendee() {
    if (!this.checkedAttendees) {
      return;
    }

    const modalOptions: NgbModalOptions = { };
    const popupModalRef = this.modal.open(AttendeeDeletePopupComponent, modalOptions);
    popupModalRef.componentInstance.eventID = this.event.ID;
    popupModalRef.componentInstance.attendees = this.checkedAttendees;
    popupModalRef.componentInstance.removedClicked.subscribe(() => {
      this.onClearAttendeeChecked();
      this.dataStateChange(this.state);
    });
  }

  onAttendeeExport() {
    const params: QueryParams = this.getAttendeeQueryParams();

    this.pagetitle.setLoading(true);
    this.service.getEventAttendeeExport(
      this.event.ID, params
    ).subscribe(data => {
      let filename: string = this.event.Name + ".xlsx";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(data, filename);
      } else {
        const url = window.URL.createObjectURL(data);

        var link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('style', 'display: none');
        link.download = filename;
        link.href = url;
        link.click();

        window.URL.revokeObjectURL(url);
        link.remove();
      }
      this.pagetitle.setLoading(false);
    }, error => {
      this.pagetitle.setLoading(false);
    });
  }

  onSendReminderClicked(event) {
    this.event.SendReminders = event.target.checked;
    event.target.disabled = true;
    this.service.saveEventInfo(this.event)
      .subscribe(result => {
        event.target.disabled = false;
        this.event = result;
      }, error => {
        event.target.disabled = false;
      });
  }

  popupAddAttendees() {
    const modalOptions: NgbModalOptions = {
      size: "lg",
      backdrop: "static"
    }
    const popupModalRef = this.modal.open(AddAttendeePopupComponent, modalOptions);
    popupModalRef.componentInstance.eventID = this.event.ID;
    popupModalRef.componentInstance.saveClicked.subscribe(() => {
      this.dataStateChange(this.state);
    });
  }

  popupEditProfile(attendee: EventAttendee) {
    if (!attendee || !attendee.Profile) {
      return;
    }

    const modalOptions: NgbModalOptions = {
      size: "lg",
      backdrop: "static"
    };

    const popupModalRef = this.modal.open(ProfileEditPopupComponent, modalOptions);
    popupModalRef.componentInstance.event = this.event;
    popupModalRef.componentInstance.profile = attendee.Profile;
    popupModalRef.componentInstance.saveClicked.subscribe(profile => {
      this.onAttendeeChanged();
      popupModalRef.close();
    });
  }

  popupEditAttendeeFields(attendee: EventAttendee) {
    if (!attendee) {
      return;
    }

    const modalOptions: NgbModalOptions = {
      size: "lg",
      backdrop: "static"
    };

    const popupModalRef = this.modal.open(AttendeeFieldsPopupComponent, modalOptions);
    popupModalRef.componentInstance.title = "Edit Other Attendee Details for " + attendee.Profile.FirstName + " " + attendee.Profile.LastName;
    popupModalRef.componentInstance.filter = Role.All;
    popupModalRef.componentInstance.event = this.event;
    popupModalRef.componentInstance.attendee = attendee;
    popupModalRef.componentInstance.saveClicked.subscribe(attendee => {
      this.onAttendeeChanged();
      popupModalRef.close();
    });
  }

  popupEditOrganizerFields(attendee: EventAttendee) {
    if (!attendee) {
      return;
    }

    const modalOptions: NgbModalOptions = {
      size: "lg",
      backdrop: "static"
    };

    const popupModalRef = this.modal.open(AttendeeFieldsPopupComponent, modalOptions);
    popupModalRef.componentInstance.title = "Edit Organizer Only for " + attendee.Profile.FirstName + " " + attendee.Profile.LastName;
    popupModalRef.componentInstance.filter = Role.BackOffice;
    popupModalRef.componentInstance.event = this.event;
    popupModalRef.componentInstance.attendee = attendee;
    popupModalRef.componentInstance.saveClicked.subscribe(attendee => {
      this.onAttendeeChanged();
      popupModalRef.close();
    });
  }

  private rebindFieldTables(fields: Array<EventField>) {
    if (fields) {
      this.isFieldsDirty = false;
      this.event.Fields = fields;
    }
    this.attendeeFields.data = this.attendeeFilter.transform(this.event.Fields);
    this.organizerFields.data = this.organizerFilter.transform(this.event.Fields);
  }

  toggleInclude(event) {
    let id: number = Number(event.target.dataset.id);
    if (isNaN(id)) {
      return;
    }
    this.event.Fields.some(f => {
      if (f.ID == id) {
        this.isFieldsDirty = true;
        f.Included = !f.Included;
        return true;
      }
    })
  }

  saveFieldChanges() {
    this.pagetitle.setLoading(true);
    this.service.saveEventFields(
      this.event.ID,
      this.event.Fields
    ).subscribe(result => {
      this.isFieldsDirty = false;
      this.pagetitle.setLoading(false);
    }, error => {
      this.pagetitle.setLoading(false);
    });
  }

  discardFieldChanges() {
    this.pagetitle.setLoading(true);
    this.service.getEventFields(
      this.event.ID
    ).subscribe(fields => {
      this.rebindFieldTables(fields);
      this.pagetitle.setLoading(false);
    }, error => {
      this.pagetitle.setLoading(false);
    });
  }

  popupDeleteField(field: EventField) {
    if (field == null) {
      return;
    }
    // Find the index
    let index: number = -1;
    if (!this.event.Fields.some((f,i) => {
      if (field.ID == f.ID) {
        index = i;
        return true;
      }
    })) {
      return;
    }

    const modalOptions: NgbModalOptions = { };
    const popupModalRef = this.modal.open(AlertPopupComponent, modalOptions);
    popupModalRef.componentInstance.title = "Delete Field";
    popupModalRef.componentInstance.text = "Are you sure you want to delete this field?";
    popupModalRef.componentInstance.primaryClicked.subscribe(() => {
      this.pagetitle.setLoading(true);
      this.service.deleteEventField(
        this.event.ID,
        field.ID
      ).subscribe(fields => {
        this.rebindFieldTables(fields);
        this.pagetitle.setLoading(false);
      }, error => {
        this.pagetitle.setLoading(false);
      })
    });
  }

  popupFieldEvent(id: number, access: Role) {
    let index: number = -1;
    let field: EventField = CommonService.getDefaultEventField(access);
    this.event.Fields.some((f,i) => {
      if (f.ID == id) {
        index = i;
        field = f;
        return true;
      }
    });
    const modalOptions: NgbModalOptions = { backdrop: "static" };
    const popupModalRef = this.modal.open(EventFieldPopupComponent, modalOptions);
    popupModalRef.componentInstance.eventID = this.event.ID;
    popupModalRef.componentInstance.fieldToEdit = field;
    popupModalRef.componentInstance.saveClicked.subscribe(field => {
      if (index < 0) {
        this.event.Fields.push(field);
      } else {
        this.event.Fields[index] = field;
      }
      this.rebindFieldTables(null);
    });
  }

  popupDeleteEvent() {
    const modalOptions: NgbModalOptions = { };
    const popupModalRef = this.modal.open(EventDeletePopupComponent, modalOptions);
    popupModalRef.componentInstance.event = this.event;
    popupModalRef.componentInstance.eventDeleted.subscribe(() => {
      popupModalRef.close();
      this.router.navigate(['events']);
    });
  }

  popupUsersEvent() {
    const modalOptions: NgbModalOptions = { };
    const popupModalRef = this.modal.open(EventUsersPopupComponent, modalOptions);
    popupModalRef.componentInstance.eventToEdit = this.event;
  }

  yesRSVPs(element: EventAttendee, index: number, array: EventAttendee[]) {
    return element.Status == AttendeeStatus.Accepted;
  }

  noRSVPs(element: EventAttendee, index: number, array: EventAttendee[]) {
    return element.Status == AttendeeStatus.Declined;
  }
}