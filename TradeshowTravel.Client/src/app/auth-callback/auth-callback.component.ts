import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: []
})
export class AuthCallbackComponent implements OnInit {
  private isSlientRefresh: boolean = false;
  private parameterSubscribe: any;
  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.parameterSubscribe = this.route.params.subscribe(params => {
      this.isSlientRefresh = params['silent'] as boolean;
      if (this.isSlientRefresh) {
        this.authService.silentRefresh();
      } else {        
        this.authService.completeAuthentication();
      }
    });
  }

  ngOnDestroy() {
    this.parameterSubscribe.unsubscribe();
  }
}