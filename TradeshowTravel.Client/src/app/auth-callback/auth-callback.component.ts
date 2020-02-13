import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: []
})
export class AuthCallbackComponent implements OnInit {
  private isSlientRefresh: boolean = false;
  private parameterSubscribe: any;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.parameterSubscribe = this.route.params.subscribe(params => {
      this.isSlientRefresh = params['silent'] as boolean;
      if (this.isSlientRefresh) {
        this.authService.silentRefresh();
      } else {        
        this.authService.completeAuthentication().then(()=>{
          var refererUrl = localStorage.getItem(environment.refererUrlKey);
     
          if (refererUrl) {
            this.router.navigate([refererUrl]);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.parameterSubscribe.unsubscribe();
  }
}