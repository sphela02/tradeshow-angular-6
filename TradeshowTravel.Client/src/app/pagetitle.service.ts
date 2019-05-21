import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { SideMenuSelection, SideMenuMode } from './shared/shared';

@Injectable()
export class PageTitleService {
  private loadingSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private messageSource: BehaviorSubject<SideMenuSelection> = new BehaviorSubject(null);
  public message = this.messageSource.asObservable();
  public loading = this.loadingSource.asObservable();

  setActivePage(main: SideMenuMode, child: string = null) {
    const selectedMenu: SideMenuSelection = <SideMenuSelection> {
      mainMenu: main,
      childMenu: child
    };
    this.messageSource.next(selectedMenu);
  }

  setLoading(isLoading: boolean) {
    this.loadingSource.next(isLoading);
  }
}
