import { Component, OnInit, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfo } from '../shared/UserInfo';
import { Permissions } from '../shared/Enums';
import { TradeshowService } from '../tradeshow.service';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-privileged-users-popup',
  templateUrl: './privileged-users-popup.component.html',
  styleUrls: ['./privileged-users-popup.component.scss']
})
export class PrivilegedUsersPopupComponent implements OnInit {
  @Input() title: string;
  @Input() privilege: Permissions;

  errorMsg: string;
  isLoading: boolean;
  users: Array<UserInfo>;
  user: UserInfo;

  constructor(
    private activeModal: NgbActiveModal,
    private service: TradeshowService
  ) {
    this.users = [];
   }

  ngOnInit() {
  }

  addUser() {
    if (!this.user) {
      return;
    }
    if (this.users.some(u => {
      if (this.user.Username == u.Username) {
        return true;
      }
    })) {
      this.user = null;
      return;
    }
    this.users.push(this.user);
    this.users.sort((a,b): number => {
      return (a.DisplayName > b.DisplayName) ? 1 : (b.DisplayName > a.DisplayName ? -1 : 0);
    })
    this.user = null;
  }

  removeUser(index: number) {
    if (index >= 0 && index < this.users.length) {
      this.users.splice(index, 1);
    }
  }

  onSubmit() {
    this.addUser();
    if (!this.users.length) {
      return;
    }
    this.isLoading = true;
    let usernames: Array<string> = [];
    this.users.forEach(u => {
      usernames.push(u.Username);
    });
    this.service.savePrivilegedUsers(this.privilege, usernames)
      .subscribe(() => {
        this.isLoading = false;
        this.activeModal.close(true);
      }, error => {
        this.errorMsg = error;
        this.isLoading = false;
      });
  }

  cancelPopup() {
    this.activeModal.dismiss();
  }

}
