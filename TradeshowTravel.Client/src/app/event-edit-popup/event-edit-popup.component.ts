import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventInfo, EventRoomBlock } from '../shared/EventInfo';
import { TradeshowService } from '../tradeshow.service';
import { CommonService } from '../common.service';
import { UserInfo } from '../shared/UserInfo';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { Role, ShowType } from '../shared/Enums';
import { PersonFinderComponent } from '../person-finder/person-finder.component';
import { isDate } from 'util';
import { Router } from '@angular/router';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';
import { UserProfile } from '../shared/UserProfile';
import { addDays } from '@progress/kendo-date-math';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit-popup.component.html',
  styleUrls: ['./event-edit-popup.component.scss']
})
export class EventEditPopupComponent implements OnInit {
  @ViewChild("rsvpDueDate") private RsvpDueDate: DatePickerComponent;
  @ViewChild("supportPF") private supportPF: PersonFinderComponent;
  @ViewChild("travelPF") private travelPF: PersonFinderComponent;
  @ViewChild("businessPF") private businessPF: PersonFinderComponent;
  @ViewChild("roomDate") private roomDate: DatePickerComponent;
  @ViewChild("roomCount") private roomCount: NumericTextBoxComponent
  @ViewChild("hotel") private hotel: ElementRef;
  @Output() saveClicked: EventEmitter<EventInfo> = new EventEmitter<EventInfo>();
  ShowType: typeof ShowType = ShowType;
  Role: typeof Role = Role;
  title: string = "Create New Event";
  event: EventInfo;
  tierList: Array<string>;
  showtypeList: Array<{ text: string, value: ShowType }>;
  segmentList: Array<string>;
  selectedSegments: Array<string>;
  supportList: Array<UserInfo>;
  travelList: Array<UserInfo>;
  businessList: Array<UserInfo>;
  roomBlockList: Array<EventRoomBlock>;
  hotelList: Array<string>;
  isLoading: boolean;
  errorMsg: string;
  isNewEvent: boolean;
  showCreateSuccess: boolean;
  currentUser: UserProfile;
  userRole: Role;

  private _eventToEdit: EventInfo;

  constructor(
    public activeModal: NgbActiveModal,
    private service: TradeshowService,
    private router: Router
  ) { }

  ngOnInit() {

    this.tierList = this.service.getTiers;

    this.service.getMyProfile().subscribe(user => {
      this.currentUser = user;
      this.onInputsChanged();
    });

    // Show Type Options Dropdown
    this.showtypeList = [];
    CommonService.enumToArray(ShowType).forEach(i => {
      let value: ShowType = i as ShowType;
      let text: string = CommonService.getShowTypeString(value);
      this.showtypeList.push({ text: text, value: value });
    });

    this.service.getSegments()
      .subscribe(segs => {
        this.segmentList = segs;
        if (!segs) {
          this.activeModal.close();
        }
      }, err => {
        this.activeModal.close();
      });

  }

  private onInputsChanged() {
    if (this.eventToEdit) {
      this.title = "Edit Event";
      this.event = Object.assign({}, this.eventToEdit);
      if (this.eventToEdit.StartDate) {
        this.event.StartDate = new Date(this.eventToEdit.StartDate);
      }
      if (this.eventToEdit.EndDate) {
        this.event.EndDate = new Date(this.eventToEdit.EndDate);
      }
      if (this.eventToEdit.RsvpDueDate) {
        this.event.RsvpDueDate = new Date(this.eventToEdit.RsvpDueDate);
      }
    } else {
      this.event = <EventInfo> { };
      this.event.SendReminders = true;
      this.isNewEvent = true;
    }

    if (!this.event.OwnerUsername && this.currentUser) {
      this.event.OwnerUsername = this.currentUser.Username;
    }

    this.selectedSegments = [];
    if (this.event.Segments) {
      this.selectedSegments = this.event.Segments.split(',');
    }

    this.hotelList = [];
    if (this.event.Hotels) {
      this.hotelList = this.event.Hotels.split('|');
    }

    this.roomBlockList = [];
    if (this.event.RoomBlocks) {
      this.event.RoomBlocks.forEach(b => {
        this.roomBlockList.push({
          Date: new Date(b.Date),
          EstRoomCount: b.EstRoomCount
        });
      });
    }

    this.supportList = [];
    this.travelList = [];
    this.businessList = [];

    if (this.event.Users) {
      this.event.Users.forEach(u => {
        if (Role.Support == (u.Role & Role.Support)) {
          this.supportList.push(u.User);
        }
        if (Role.Travel == (u.Role & Role.Travel)) {
          this.travelList.push(u.User);
        }
        if (Role.Business == (u.Role & Role.Business)) {
          this.businessList.push(u.User);
        }
      });
    }

    this.userRole = CommonService.getEventRole(
      this.currentUser, this.eventToEdit
    );
  }

  @Input()
  set eventToEdit(event: EventInfo) {
    this._eventToEdit = event;
    this.onInputsChanged();
  }
  get eventToEdit(): EventInfo {
    return this._eventToEdit;
  }

  addSupport() {
    if (!this.supportPF.value) {
      return;
    }
    if (this.userRole != Role.Lead && this.userRole != Role.Support) {
      return;
    }
    let username = this.supportPF.value.Username;
    if (this.supportList.find(u => {
      return u.Username == username;
    })) {
      this.supportPF.value = null;
      return;
    }
    this.supportList.push(this.supportPF.value);
    this.supportPF.value = null;
  }
  removeSupport(event) {
    if (this.userRole == Role.Lead || this.userRole == Role.Support) {
      let index = Number(event.currentTarget.dataset.index);
      if (index >= 0 && index < this.supportList.length) {
        this.supportList.splice(index, 1);
      }
    }
  }

  addTravel() {
    if (!this.travelPF.value) {
      return;
    }
    if (this.userRole != Role.Lead && this.userRole != Role.Support) {
      return;
    }
    let username = this.travelPF.value.Username;
    if (this.travelList.find(u => {
      return u.Username == username;
    })) {
      this.travelPF.value = null;
      return;
    }
    this.travelList.push(this.travelPF.value);
    this.travelPF.value = null;
  }
  removeTravel(event) {
    if (this.userRole == Role.Lead || this.userRole == Role.Support) {
      let index = Number(event.currentTarget.dataset.index);
      if (index >= 0 && index < this.travelList.length) {
        this.travelList.splice(index, 1);
      }
    }
  }

  addBusiness() {
    if (!this.businessPF.value) {
      return;
    }
    if (this.userRole != Role.Lead && this.userRole != Role.Support) {
      return;
    }
    let username = this.businessPF.value.Username;
    if (this.businessList.find(u => {
      return u.Username == username;
    })) {
      this.businessPF.value = null;
      return;
    }
    this.businessList.push(this.businessPF.value);
    this.businessPF.value = null;
  }
  removeBusiness(event) {
    if (this.userRole == Role.Lead || this.userRole == Role.Support) {
      let index = Number(event.currentTarget.dataset.index);
      if (index >= 0 && index < this.businessList.length) {
        this.businessList.splice(index, 1);
      }
    }
  }

  addHotel() {
    if (!this.hotel.nativeElement.value) {
      return;
    }
    let name = this.hotel.nativeElement.value.toLowerCase();
    if (this.hotelList.find(h => {
      return name == h.toLowerCase();
    })) {
      this.hotel.nativeElement.value = "";
      return;
    }
    this.hotelList.push(this.hotel.nativeElement.value);
    this.hotel.nativeElement.value = null;
  }
  removeHotel(event) {
    let index = Number(event.currentTarget.dataset.index);
    if (index >= 0 && index < this.hotelList.length) {
      this.hotelList.splice(index, 1);
    }
  }

  addRoomBlock() {
    if (this.roomCount.value < 1) {
      return;
    }
    if (!this.roomDate.value) {
      return;
    }
    if (this.roomBlockList.some(b => {
      if (b.Date.getDate() == this.roomDate.value.getDate() &&
          b.Date.getFullYear() == this.roomDate.value.getFullYear() &&
          b.Date.getMonth() == this.roomDate.value.getMonth()) {
        b.EstRoomCount = this.roomCount.value;
        return true;
      }
    })) {
      return;
    }
    this.roomBlockList.push({
      Date: this.roomDate.value,
      EstRoomCount: this.roomCount.value
    });
    this.roomBlockList.sort(function(a,b) {
      return (a.Date > b.Date) ? 1 : ((b.Date > a.Date) ? -1 : 0)
    });
    this.roomDate.value = addDays(this.roomDate.value, 1);
    this.roomDate.focus();
    this.roomDate.blur();
  }
  removeRoomBlock(event) {
    let index = Number(event.currentTarget.dataset.index);
    if (index >= 0 && index < this.roomBlockList.length) {
      this.roomBlockList.splice(index, 1);
    }
  }

  onStartChange(value: Date) {
    if (!this.event.EndDate || value > this.event.EndDate) {
      this.event.EndDate = value;
    }

    if (this.event.RsvpDueDate && value < this.event.RsvpDueDate) {
      this.event.RsvpDueDate = value;
    }
    this.RsvpDueDate.max = value;
  }
  onEndChange(value: Date) {
    if (!this.event.StartDate || value < this.event.StartDate) {
      this.event.StartDate = value;
      this.onStartChange(value);
    }
  }

  cancelPopup() {
    this.activeModal.close();
  }

  get IsValid() : boolean {
    if (!this.event.Name) {
      return false;
    }
    if (!this.event.StartDate) {
      return false;
    }
    if (!this.event.EndDate) {
      return false;
    }
    if (!this.event.ShowType) {
      return false;
    }
    if (!this.event.OwnerUsername) {
      return false;
    }
    if (this.event.EstAttendCount) {
      if (isNaN(Number(this.event.EstAttendCount))) {
        return false;
      } else if (this.event.EstAttendCount < 0) {
        return false;
      }
    }
    return true;
  }

  onGotoEvent() {
    this.router.navigate(['events', this.eventToEdit.ID]);
    this.activeModal.close();
  }

  onSubmit(form: any) {
    this.addRoomBlock();
    this.addHotel();
    this.addSupport();
    this.addTravel();
    this.addBusiness();

    this.event.Segments = this.selectedSegments.join(',');
    this.event.Hotels = this.hotelList.join('|');
    this.event.RoomBlocks = [];
    // get room blocks
    this.roomBlockList.sort(function(a,b) {
      return (a.Date > b.Date) ? 1 : ((b.Date > a.Date) ? -1 : 0)
    }).forEach(b => {
      this.event.RoomBlocks.push(b);
    });
    this.event.Users = [];
    // get support users
    this.supportList.forEach(u => {
      if (!this.event.Users.find(f => {
        if (f.User.Username == u.Username) {
          f.Role = f.Role | Role.Support;
          return true;
        }
        return false;
      })) {
        this.event.Users.push({
          Role: Role.Support,
          User: u
        });
      }
    });
    // get travel users
    this.travelList.forEach(u => {
      if (!this.event.Users.find(f => {
        if (f.User.Username == u.Username) {
          f.Role = f.Role | Role.Travel;
          return true;
        }
        return false;
      })) {
        this.event.Users.push({
          Role: Role.Travel,
          User: u
        });
      }
    });
    // get business users
    this.businessList.forEach(u => {
      if (!this.event.Users.find(f => {
        if (f.User.Username == u.Username) {
          f.Role = f.Role | Role.Business;
          return true;
        }
        return false;
      })) {
        this.event.Users.push({
          Role: Role.Business,
          User: u
        });
      }
    });

    this.isLoading = true;
    this.service.saveEventInfo(this.event)
      .subscribe(result => {
        this.errorMsg = null;
        this.saveClicked.emit(result);
        this.isLoading = false;
        if (this.isNewEvent) {
          this.title = "New Event Created Successfully!"
          this.eventToEdit = result;
          this.showCreateSuccess = true;
        }
      }, error => {
        this.errorMsg = error;
        this.isLoading = false;
      });
  }
}
