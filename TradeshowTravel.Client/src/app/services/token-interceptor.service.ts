import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (environment.useSingleSignOn) {
      request = request.clone({
        setHeaders: {
          Authorization: this.auth.getAuthorizationHeaderValue()
        }
      });
    }
    return next.handle(request);
  }
}