import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let isloggedIn = this.authService.isLoggedIn();
    isloggedIn.subscribe((loggedin) => {
      if (!loggedin && !state.url.includes("auth-callback")) {
        localStorage.setItem(environment.refererUrlKey, state.url);
        this.authService.startAuthentication();
      }
    });
    return isloggedIn;
  }
}