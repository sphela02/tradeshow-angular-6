import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventMainComponent } from './event-main/event-main.component';
import { AttendeeMainComponent } from './attendee-main/attendee-main.component';
import { SettingsComponent } from './settings/settings.component';

import { EventViewMode, AttendeeViewMode } from './shared/shared';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';


const routes: Routes = [
    { path: 'events', component: EventMainComponent, data: [{ eventViewMode: EventViewMode.List }], canActivate: [AuthGuardService] },
    { path: 'events/:id', component: EventMainComponent, data: [{ eventViewMode: EventViewMode.Display }], canActivate: [AuthGuardService] },
    { path: 'attendees', component: AttendeeMainComponent, data: [{ viewMode: AttendeeViewMode.List }], canActivate: [AuthGuardService] },
    { path: 'attendees/:id', component: AttendeeMainComponent, data: [{ viewMode: AttendeeViewMode.Display }], canActivate: [AuthGuardService] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
    { path: 'auth-callback/:silent', component: AuthCallbackComponent },
    { path: 'auth-callback', component: AuthCallbackComponent },
    { path: '**', component: AttendeeMainComponent, data: [{ viewMode: AttendeeViewMode.MyProfile }] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuardService, AuthService]
})
export class AppRoutingModule { }