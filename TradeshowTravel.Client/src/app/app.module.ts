import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { CommonService } from './common.service';
import { TradeshowService } from './tradeshow.service';
import { PageTitleService } from './pagetitle.service';
import { SettingsComponent } from './settings/settings.component';

import { AppRoutingModule } from './app-routing.module';
import { ProfileEditPopupComponent } from './profile-edit-popup/profile-edit-popup.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventMainComponent } from './event-main/event-main.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { EventEditPopupComponent } from './event-edit-popup/event-edit-popup.component';
import { EventViewComponent } from './event-view/event-view.component';

import { KeysPipe } from './shared/pipes/keys.pipe';
import { ReplacePipe } from './shared/pipes/replace.pipe';
import { AttendeeFieldsFilterPipe } from './shared/pipes/attendee-fields-filter.pipe';
import { OrganizerFieldsFilterPipe } from './shared/pipes/organizer-fields-filter.pipe';
import { EventUserFilterPipe } from './shared/pipes/event-user-filter.pipe';

import { PersonFinderComponent } from './person-finder/person-finder.component';
import { EventDeletePopupComponent } from './event-delete-popup/event-delete-popup.component';
import { GridSegFilterComponent } from './shared/grid-seg-filter.component';
import { GridRsvpFilterComponent } from './shared/grid-rsvp-filter.component';
import { GridYesNoFilterComponent } from './shared/grid-yesno-filter.component';
import { EventUsersPopupComponent } from './event-users-popup/event-users-popup.component';
import { EventFieldPopupComponent } from './event-field-popup/event-field-popup.component';
import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { AddAttendeePopupComponent } from './add-attendee-popup/add-attendee-popup.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { AttendeeFieldsPopupComponent } from './attendee-fields-popup/attendee-fields-popup.component';
import { AttendeeFieldsComponent } from './attendee-fields/attendee-fields.component';
import { AttendeeDeletePopupComponent } from './attendee-delete-popup/attendee-delete-popup.component';
import { FileAttachmentComponent } from './file-attachment/file-attachment.component';
import { SendRsvpPopupComponent } from './send-rsvp-popup/send-rsvp-popup.component';
import { SendReminderPopupComponent } from './send-reminder-popup/send-reminder-popup.component';
import { AttendeeViewComponent } from './attendee-view/attendee-view.component';
import { AttendeeMainComponent } from './attendee-main/attendee-main.component';
import { AttendeeListComponent } from './attendee-list/attendee-list.component';
import { AttendeeRsvpPopupComponent } from './attendee-rsvp-popup/attendee-rsvp-popup.component';
import { EventInfoComponent } from './event-info/event-info.component';
import { PrivilegedUsersListComponent } from './privileged-users-list/privileged-users-list.component';
import { PrivilegedUsersPopupComponent } from './privileged-users-popup/privileged-users-popup.component';
import { ProfileImageUploadPopupComponent } from './profile-image-upload-popup/profile-image-upload-popup.component';
import { UploadModule } from '@progress/kendo-angular-upload';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    GridModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    UploadModule,
    NgbModule.forRoot()
  ],
  providers: [
    CommonService,
    TradeshowService, 
    PageTitleService
  ],
  declarations: [
    AppComponent,
    SettingsComponent,
    ProfileEditPopupComponent,
    EventListComponent,
    EventMainComponent,
    EventEditPopupComponent,
    EventViewComponent,
    KeysPipe,
    ReplacePipe,
    PersonFinderComponent,
    EventDeletePopupComponent,
    GridSegFilterComponent,
    EventUsersPopupComponent,
    EventFieldPopupComponent,
    AttendeeFieldsFilterPipe,
    OrganizerFieldsFilterPipe,
    AlertPopupComponent,
    AddAttendeePopupComponent,
    EventUserFilterPipe,
    ProfileInfoComponent,
    AttendeeFieldsPopupComponent,
    AttendeeFieldsComponent,
    AttendeeDeletePopupComponent,
    SendRsvpPopupComponent,
    SendReminderPopupComponent,
    GridRsvpFilterComponent,
    AttendeeViewComponent,
    AttendeeMainComponent,
    AttendeeListComponent,
    AttendeeRsvpPopupComponent,
    EventInfoComponent,
    PrivilegedUsersListComponent,
    PrivilegedUsersPopupComponent,
    ProfileImageUploadPopupComponent,
    GridYesNoFilterComponent,
    FileAttachmentComponent
  ],
  entryComponents: [
    ProfileEditPopupComponent,
    EventEditPopupComponent,
    EventDeletePopupComponent,
    EventUsersPopupComponent,
    EventFieldPopupComponent,
    AddAttendeePopupComponent,
    AttendeeFieldsPopupComponent,
    AttendeeDeletePopupComponent,
    SendRsvpPopupComponent,
    SendReminderPopupComponent,
    AttendeeRsvpPopupComponent,
    PrivilegedUsersPopupComponent,
    AlertPopupComponent,
    ProfileImageUploadPopupComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
