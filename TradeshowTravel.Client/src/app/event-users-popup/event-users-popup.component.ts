import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TradeshowService } from '../tradeshow.service';
import { EventInfo, EventUser } from '../shared/EventInfo';
import { UserInfo } from '../shared/UserInfo';
import { Role } from '../shared/Enums';
import { PersonFinderComponent } from '../person-finder/person-finder.component';

@Component({
  selector: 'app-event-users-popup',
  templateUrl: './event-users-popup.component.html',
  styleUrls: ['./event-users-popup.component.scss']
})
export class EventUsersPopupComponent implements OnInit {
  @ViewChild("supportPF") private supportPF: PersonFinderComponent;
  @ViewChild("travelPF") private travelPF: PersonFinderComponent;
  @ViewChild("businessPF") private businessPF: PersonFinderComponent;
  @Input() eventToEdit: EventInfo;
  @Output() saveClicked: EventEmitter<any> = new EventEmitter<any>();
  isLoading: boolean = false;
  owner: UserInfo;
  supportList: Array<UserInfo> = [];
  travelList: Array<UserInfo> = [];
  businessList: Array<UserInfo> = [];
  errorMsg: string;

  constructor(
    private activeModal: NgbActiveModal,
    private service: TradeshowService
  ) { }

  ngOnInit() {
    if (this.eventToEdit) {
      this.owner = this.eventToEdit.Owner;
      if (this.eventToEdit.Users) {
        this.eventToEdit.Users.forEach(u => {
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
    }
  }

  addSupport() {
    if (!this.supportPF.value) {
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
  addTravel() {
    if (!this.travelPF.value) {
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
  addBusiness() {
    if (!this.businessPF.value) {
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
  
  removeSupport(event) {
    let index = Number(event.currentTarget.dataset.index);
    if (index >= 0 && index < this.supportList.length) {
      this.supportList.splice(index, 1);
    }
  }
  removeTravel(event) {
    let index = Number(event.currentTarget.dataset.index);
    if (index >= 0 && index < this.travelList.length) {
      this.travelList.splice(index, 1);
    }
  }
  removeBusiness(event) {
    let index = Number(event.currentTarget.dataset.index);
    if (index >= 0 && index < this.businessList.length) {
      this.businessList.splice(index, 1);
    }
  }

  cancelPopup() {
    this.activeModal.close("Cancel Clicked");
  }

  onSubmit() {
    if (!this.owner) {
      return;
    }

    let users : Array<EventUser> = [];
    
    if (this.eventToEdit.OwnerUsername != this.owner.Username) {
      users.push(<EventUser> { 
        User: this.owner,
        Role: Role.Lead
      });
    }

    // get support users
    this.supportList.forEach(u => {
      if (!users.find(f => {
        if (f.User.Username == u.Username) {
          f.Role = f.Role | Role.Support;
          return true;
        }
        return false;
      })) {
        users.push({
          Role: Role.Support,
          User: u
        });
      }
    });
    // get travel users
    this.travelList.forEach(u => {
      if (!users.find(f => {
        if (f.User.Username == u.Username) {
          f.Role = f.Role | Role.Travel;
          return true;
        }
        return false;
      })) {
        users.push({
          Role: Role.Travel,
          User: u
        });
      }
    });
    // get business users
    this.businessList.forEach(u => {
      if (!users.find(f => {
        if (f.User.Username == u.Username) {
          f.Role = f.Role | Role.Business;
          return true;
        }
        return false;
      })) {
        users.push({
          Role: Role.Business,
          User: u
        });
      }
    });

    this.isLoading = true;
    this.service.saveEventUsers(this.eventToEdit.ID, users)
      .subscribe(result => {
        this.errorMsg = null;
        this.eventToEdit.OwnerUsername = this.owner.Username;
        this.eventToEdit.Owner = this.owner;
        this.eventToEdit.Users = users;
        this.activeModal.close();
      }, error => {
        this.errorMsg = error;
        this.isLoading = false;
      });
  }
}
