import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  private manager = new UserManager(getClientSettings());
  private user: User | null = null;

  constructor() {
    this.getUser();
  }

  getUser(): Promise<User> {
    return this.manager.getUser().then(user => {
      this.user = user;
      return this.user;
    });
  }

  isLoggedIn(): Observable<boolean> {
    return Observable.fromPromise(this.getUser()).map<User, boolean>((user) => user != null && !this.user.expired);
  }

  getClaims(): any {
    return this.user!.profile;
  }

  getAuthorizationHeaderValue(): string {
    if (this.user == null) { return ""; }
    return `${this.user!.token_type} ${this.user!.id_token}`;
  }

  silentRefresh(): Promise<User | undefined> {
    return this.manager.signinSilentCallback();
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
    });
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.authority,
    client_id: environment.clientId,
    redirect_uri: environment.redirectUri,
    post_logout_redirect_uri: environment.postLogoutRedirectUri,
    response_type: 'code',
    scope: 'openid',
    filterProtocolClaims: true,
    loadUserInfo: false,
    client_secret: environment.clientSecret,
    automaticSilentRenew: true,
    silent_redirect_uri: environment.silentRedirectUri,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  };
}