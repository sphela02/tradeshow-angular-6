import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventInfo } from '../shared/EventInfo';
import { CommonService } from '../common.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventEditPopupComponent } from '../event-edit-popup/event-edit-popup.component';
import { SideMenuMode } from '../shared/shared';
import { PageTitleService } from '../pagetitle.service';
import { Role } from '../shared/Enums';
import { UserProfile } from '../shared/UserProfile';
import { TradeshowService } from '../tradeshow.service';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent implements OnInit {
  @Output() eventChange = new EventEmitter<EventInfo>();
  HelperSvc: typeof CommonService = CommonService;
  Role: typeof Role = Role;

  currentUser: UserProfile;
  showEditLink: boolean = false;
  showAllInfo: boolean = false;

  private _event: EventInfo;
  private _readonly: boolean;

  constructor(
    private pagesvc: PageTitleService,
    private service: TradeshowService,
    private modal: NgbModal
  ) { }

  ngOnInit() {
    this.service.getMyProfile().subscribe(user => {
      this.currentUser = user;
      this.onInputsChanged();
    });
  }

  popupEditEvent() {
    if (!this.showEditLink) {
      return;
    }
    const modalOptions: NgbModalOptions = { size: "lg", backdrop: "static" };
    const popupModalRef = this.modal.open(EventEditPopupComponent, modalOptions);
    popupModalRef.componentInstance.eventToEdit = this.event;
    popupModalRef.componentInstance.saveClicked.subscribe(event => {
      this.event = event;
      this.eventChange.emit(event);
      popupModalRef.close();
    });
  }

  toggleShowAll() {
    this.showAllInfo = !this.showAllInfo;
  }

  private onInputsChanged() {
    this.showEditLink = !this.readonly &&
      CommonService.canEditEvent(
        this.currentUser, this.event
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

  @Input()
  set readonly(readonly: boolean) {
    this._readonly = readonly;
    this.onInputsChanged();
  }
  get readonly(): boolean {
    return this._readonly;
  }

  get eventStatus(): string {
    const now = new Date(Date.now());
    const start = new Date(this.event.StartDate);
    if (start > now) {
      return "UPCOMING";
    } else {
      return "PAST";
    }
  }
}
