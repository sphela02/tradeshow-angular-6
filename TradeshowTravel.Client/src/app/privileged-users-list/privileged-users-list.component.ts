import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Permissions } from '../shared/Enums';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { TradeshowService } from '../tradeshow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivilegedUsersPopupComponent } from '../privileged-users-popup/privileged-users-popup.component';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';
import { UserProfile } from '../shared/UserProfile';

@Component({
  selector: 'app-privileged-users-list',
  templateUrl: './privileged-users-list.component.html',
  styleUrls: ['./privileged-users-list.component.scss']
})
export class PrivilegedUsersListComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;
  private _privilege: Permissions = Permissions.None;

  @Input() title: string;

  sort: SortDescriptor[] = [{
    field: 'ProductName',
    dir: 'asc'
  }];

  gridView: GridDataResult;
  showEdit: boolean;

  constructor(
    private service: TradeshowService,
    private modal: NgbModal
  ) { }

  ngOnInit() {
    this.service.getMyProfile().subscribe(me => {
      this.showEdit = (me.Privileges == Permissions.Admin);
    });
  }

  popupAddUsers() {
    const popupModalRef = this.modal.open(PrivilegedUsersPopupComponent);
    popupModalRef.componentInstance.title = this.title;
    popupModalRef.componentInstance.privilege = this.privilege;
    popupModalRef.result.then((result) => {
      this.onInputsChanged();
    })
  }

  onRemoveUser(username: string) {
    if (!username) {
      return;
    }
    const popupModalRef = this.modal.open(AlertPopupComponent);
    popupModalRef.componentInstance.title = "Remove User Permission";
    popupModalRef.componentInstance.text = "Are you sure you want to remove '" + username + "' from the " + this.title + "?";
    popupModalRef.componentInstance.primaryClicked.subscribe(() => {
      this.grid.loading = true;
      this.service.removePrivilegedUser(this.privilege, username)
        .subscribe(() => {
          this.onInputsChanged();
        }, error => {
          this.grid.loading = false;
        });
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.onInputsChanged();
  }

  private onInputsChanged() {
    if (this.privilege) {
      this.grid.loading = true;
      this.service.getPrivilegedUsers(this.privilege)
        .subscribe(users => {
          this.gridView = {
            data: orderBy(users, this.sort),
            total: users.length
          };
          this.grid.loading = false;
        }, error => {
          this.grid.loading = false;
        });
    }
  }

  @Input()
  set privilege(privilege: Permissions) {
    this._privilege = privilege;
    this.onInputsChanged();
  }
  get privilege(): Permissions {
    return this._privilege;
  }
}
