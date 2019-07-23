import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of }         from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import 'rxjs/add/operator/delay';

import { environment } from '../environments/environment';
import { UserProfile } from './shared/UserProfile';
import { catchError } from 'rxjs/operators';
import { Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { ReplaySubject, Observer, BehaviorSubject } from 'rxjs';
import { ShowType, Permissions } from './shared/Enums';
import { EventInfo, EventUser, EventField } from './shared/EventInfo';
import { QueryParams } from './shared/QueryParams';
import { EventQueryResult } from './shared/EventQuery';
import { UserInfo } from './shared/UserInfo';
import { PageTitleService } from './pagetitle.service';
import { EventAttendee } from './shared/EventAttendee';
import { EventAttendeeQueryResult } from './shared/EventAttendeeQuery';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { addMonths, addDays, lastDayOfMonth } from '@progress/kendo-date-math';
import { Location } from '@angular/common';
import { RsvpRequest } from './shared/RsvpRequest';
import { ReminderRequest } from './shared/ReminderRequest';
import { AttendeeQueryResult } from './shared/AttendeeQuery';
import { AttendeeEvent } from './shared/AttendeeEvent';
import { UserPic } from './shared/UserImage';
import { ContentType } from '@angular/http/src/enums';
import { ObserveOnOperator } from 'rxjs/operators/observeOn';
import { TravelDoc } from './shared/UserImage';

@Injectable()
export class TradeshowService {
  private _serviceUrl: string;
  private _piServiceUrl: string;
  private _currentUser: UserProfile;
  private _segments: Array<string>;
  private _showTypes: Array<string>;
  private _tiers: Array<string>;
  private _eventListState: DataStateChangeEvent;
  private _attendeeListState: DataStateChangeEvent;

  constructor(
    private http: HttpClient,
    private location: Location,
  ) {
    let url: string = this.location.normalize(environment.apiServiceURL);
    if (url.indexOf("http") == -1) {
      url = this.location.prepareExternalUrl(url);
    }
    this._serviceUrl = url;

    let piUrl: string = this.location.normalize(environment.apiPiServiceURL);
    if (piUrl.indexOf("http") == -1) {
      piUrl = this.location.prepareExternalUrl(piUrl);
    }
    this._piServiceUrl = piUrl;

    this._tiers = [
      "",
      "Tier 1",
      "Tier 2",
      "Tier 3",
      "Tier 4",
      "Customer Event"
    ];
  }

  private get currentUser(): UserProfile {
    return this._currentUser;
  }
  private set currentUser(user: UserProfile) {
    this._currentUser = user;
  }

  private get segments(): Array<string> {
    return this._segments;
  }
  private set segments(segments: Array<string>) {
    this._segments = segments;
  }

  get eventListState(): DataStateChangeEvent {
    if (!this._eventListState) {
      const date = new Date(Date.now());
      const start = date;
      //const end = lastDayOfMonth(addMonths(date, 3));
      const end = lastDayOfMonth(addMonths(date, 60));
      this._eventListState = <DataStateChangeEvent> {
        skip: 0,
        take: 25,
        filter: {
          filters: [{
            logic: "and",
            filters: [
              { field: "StartDate", operator: "gt", value: start },
              { field: "StartDate", operator: "lt", value: end }
            ]
          }]
        },
        sort: [{ field: 'StartDate', dir: 'asc' }]
      }
    }
    return this._eventListState;
  }
  set eventListState(state: DataStateChangeEvent) {
    this._eventListState = state;
  }

  get attendeeListState(): DataStateChangeEvent {
    if (!this._attendeeListState) {
      this._attendeeListState = <DataStateChangeEvent> {
        skip: 0,
        take: 25,
        filter: { logic: "and", filters: [] },
        sort: [{ field: "User.FirstName", dir: "asc" }, { field: "User.LastName", dir: "asc" }]
      }
    }
    return this._attendeeListState;
  }
  set attendeeListState(state: DataStateChangeEvent) {
    this._attendeeListState = state;
  }

  getPhoto(url: string) : Observable<Blob> {  
    return new Observable(observer => {
      this.http.get(url, { responseType: 'blob', withCredentials: true })
      .pipe(catchError(this.handleError))
      .subscribe(pic => {
        observer.next(pic);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    });
  }

  getUsersByUsername(username: string): Observable<Array<UserInfo>> {
    let url: string = this._serviceUrl + "/users/search?username=" + encodeURI(username);
    return new Observable(observer => {
      this.http.get<UserInfo>(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(users => {
          observer.next(users);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }
  getUsersByName(name: string): Observable<Array<UserInfo>> {
    let url: string = this._serviceUrl + "/users/search?name=" + encodeURI(name);
    return new Observable(observer => {
      this.http.get<UserInfo>(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(users => {
          observer.next(users);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  getMyProfile(): Observable<UserProfile> {
    return new Observable(observer => {
      if (this.currentUser) {
        observer.next(this.currentUser);
        observer.complete();
      } else {
        let url: string = this._serviceUrl + "/users/me";
        this.http.get<UserProfile>(url, { withCredentials: true })
          .pipe(catchError(this.handleError))
          .subscribe(profile => {
            this.currentUser = profile;
            observer.next(profile);
            observer.complete();
          }, error => {
            observer.error(error);
          });
      }
    });
  }

  getUserProfile(username: string): Observable<UserProfile> {
    let url: string = this._serviceUrl + "/users/" + username.toLocaleLowerCase();
    return new Observable(oberver => {
      if (this.currentUser &&
          this.currentUser.Username.toUpperCase() == username.toUpperCase()) {
        oberver.next(this.currentUser);
        oberver.complete();
      } else {
        this.http.get<UserProfile>(url, { withCredentials: true })
          .pipe(catchError(this.handleError))
          .subscribe(profile => {
            oberver.next(profile);
            oberver.complete();
          }, error => {
            oberver.error(error);
          });
      }
    });
  }

  saveUserProfile(profileToSave: UserProfile): Observable<UserProfile> {
    let url: string = this._serviceUrl + "/users/save";
    return new Observable(observer => {
      this.http.post<UserProfile>(url, profileToSave,
        { withCredentials: true})
        .pipe(catchError(this.handleError))
        .subscribe(profile => {
          if (this.currentUser &&
              this.currentUser.Username.toUpperCase() == profile.Username.toUpperCase()) {
            this.currentUser = profile;
          }
          observer.next(profile);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  getUserDelegate(username: string) : Observable<UserInfo> {
    let url: string = this._serviceUrl + "/users/" + username + "/delegate";
    return new Observable(observer => {
      this.http.get<UserInfo>(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(user => {
          observer.next(user)
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  getPrivilegedUsers(privilege: Permissions): Observable<Array<UserProfile>> {
    let url: string = this._serviceUrl + "/privileged/" + privilege.toString() + "/users";
    return new Observable(observer => {
      this.http.get<Array<UserProfile>>(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(profiles => {
          observer.next(profiles);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  savePrivilegedUsers(privilege: Permissions, usernames: Array<string>): Observable<boolean> {
    let url: string = this._serviceUrl + "/privileged/" + privilege.toString() + "/save";
    return new Observable(observer => {
      this.http.post<Array<string>>(url, usernames, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(() => {
          observer.next(true);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  removePrivilegedUser(privilege: Permissions, username: string): Observable<boolean> {
    let url: string = this._serviceUrl + "/privileged/" + privilege.toString() + "/" + username.toLocaleLowerCase();
    return new Observable(observer => {
      this.http.delete(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(() => {
          observer.next(true);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    })
  }

  getEvents(params: QueryParams): Observable<EventQueryResult> {
    let url: string = this._serviceUrl + "/events";
    return new Observable(observer => {
      this.http.post<EventQueryResult>(url, params,
        { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(results => {
          observer.next(results);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  getEventInfo(eventID: number): Observable<EventInfo> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString();
    return new Observable(observer => {
      this.http.get<EventInfo>(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(event => {
          observer.next(event);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  saveEventInfo(eventToSave: EventInfo): Observable<EventInfo> {
    let url: string = this._serviceUrl + "/events/save";
    return new Observable(observer => {
      this.http.post<EventInfo>(url, eventToSave,
        { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(event => {
          observer.next(event);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  deleteEvent(eventID: number): Observable<boolean> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString();
    return new Observable(observer => {
      this.http.delete(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(() => {
          observer.next(true);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  saveEventUsers(eventID: number, users: Array<EventUser>): Observable<boolean> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/users/save";
    return new Observable(observer => {
      this.http.post(url, users, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(event => {
          observer.next(event);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  getEventFields(eventID: number): Observable<Array<EventField>> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/fields";
    return new Observable(observer => {
      this.http.get<Array<EventField>>(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(fields => {
          observer.next(fields);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  saveEventFields(eventID: number, fields: Array<EventField>): Observable<boolean> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/fields/save";
    return new Observable(observer => {
      this.http.post(url, fields, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(events => {
          observer.next(events);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  saveEventField(eventID: number, field: EventField): Observable<EventField> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/fields/save";
    let fields: Array<EventField> = [ field ];
    return new Observable(observer => {
      this.http.post(url, fields, { withCredentials: true })
      .pipe(catchError(this.handleError))
      .subscribe(result => {
        observer.next(result);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  deleteEventField(eventID: number, fieldID: number): Observable<Array<EventField>> {
    let url: string = this._serviceUrl +
      "/events/" + eventID.toString() +
      "/fields/" + fieldID.toString();
    return new Observable(observer => {
      this.http.delete<Array<EventField>>(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(fields => {
          observer.next(fields);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    })
  }

  getEventAttendeeExport(eventID: number, params: QueryParams) : Observable<Blob> {
    let url: string = this._serviceUrl + "/events/attendees/export/" + eventID.toString();
    return new Observable(observer => {
      this.http.post(url, params, {
        params: {},
        headers: {},
        responseType: 'blob',
        withCredentials: true
      })
      .pipe(catchError(this.handleError))
      .subscribe(data => {
        observer.next(data);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    });
  }

  getEventAttendees(eventID: number, params: QueryParams): Observable<EventAttendeeQueryResult> {
    let url: string = "/events/" + eventID.toString() + "/attendees";
    return new Observable(observer => {
      this.http.post<EventAttendeeQueryResult>(this._piServiceUrl + url, params,
        { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(results => {
          observer.next(results);
          observer.complete();
        }, error => {
          this.http.post<EventAttendeeQueryResult>(this._serviceUrl + url, params,
            { withCredentials: true })
            .pipe(catchError(this.handleError))
            .subscribe(results => {
              observer.next(results);
              observer.complete();
            }, error => {
              observer.error(error);
            })
        })
    });
  }

  saveAttendee(eventID: number, attendee: EventAttendee): Observable<EventAttendee> {
    let url: string = "/events/" + eventID.toString() + "/attendees/save";
    return new Observable(observer => {
      this.http.post(this._serviceUrl + url, attendee, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(attendee => {
          observer.next(attendee);
          observer.complete();
        }, error => {
          this.http.post(this._piServiceUrl + url, attendee, { withCredentials: true })
        .pipe(catchError(this.handleError))
          .subscribe(attendee => {
              observer.next(attendee);
              observer.complete();
            }, error => {
              observer.error(error);
            })
          })
    });
  }

  saveEventAttendees(eventID: number, attendees: Array<EventAttendee>): Observable<boolean> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/attendees/saveall";
    return new Observable(observer => {
      this.http.post(url, attendees, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  getEventAttendee(attendeeID: number): Observable<EventAttendee> {
    let url: string = this._serviceUrl + "/attendees/" + attendeeID.toString();
    return new Observable(observer => {
      this.http.get<EventAttendee>(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(attendee => {
          observer.next(attendee);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  deleteEventAttendees(eventID: number, attendees: Array<number>): Observable<boolean> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/attendees/delete";
    if (attendees && attendees.length) {
      url += "?ids=" + attendees.join("&ids=");
    }
    return new Observable(observer => {
      this.http.delete(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  uploadAttachment(eventID: number, req: FormData): Observable<string> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/uploadAttachment";
    return new Observable(observer => {
      this.http.post(url, req, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  sendRsvpRequest(eventID: number, req: RsvpRequest): Observable<boolean> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/sendrsvp";
    return new Observable(observer => {
      this.http.post(url, req, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  sendReminder(eventID: number, req: ReminderRequest): Observable<boolean> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString() + "/sendreminder";
    return new Observable(observer => {
      this.http.post(url, req, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  getAttendees(params: QueryParams): Observable<AttendeeQueryResult> {
    let url: string = "/attendees";
    return new Observable(observer => {
      this.http.post<AttendeeQueryResult>(this._piServiceUrl + url, params,
        { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(results => {
          observer.next(results);
          observer.complete();
        }, error => {
          this.http.post<AttendeeQueryResult>(this._serviceUrl, params,
            { withCredentials: true })
            .pipe(catchError(this.handleError))
            .subscribe(results => {
              observer.next(results);
              observer.complete();
            }, error => {
              observer.error(error);
            })
        })
    });
  }

  getAttendeeEvents(username: string, ): Observable<Array<AttendeeEvent>> {
    let url: string = "/attendees/" + username.toLowerCase() + "/events";

    return new Observable(observer => {
      this.http.get<Array<AttendeeEvent>>(this._serviceUrl + url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(events => {
          observer.next(events);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  getSegments(): Observable<Array<string>> {
    return new Observable(observer => {
      if (this.segments && this.segments.length) {
        observer.next(this.segments);
        observer.complete();
      } else {
        let url: string = this._serviceUrl + "/segments";
        this.http.get<Array<string>>(url, { withCredentials: true })
          .pipe(catchError(this.handleError))
          .subscribe(segments => {
            this.segments = segments;
            observer.next(segments);
            observer.complete();
          }, error => {
            observer.error(error);
          });
      }
    });
  }

  get getTiers(): string[] {
    return this._tiers;
  }

  get getShowTypes(): string[] {
    if (!this._showTypes) {
      const keys = Object.keys(ShowType);
      this._showTypes = keys.slice(keys.length / 2);
      this._showTypes[0] = "";
    }
    return this._showTypes;
  }

  private handleError(error: HttpErrorResponse) {
    let msg = "Something bad happened; please try again later.";
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      if (error.error) {
        msg = error.error;
      }
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(msg);
  }

  getAvatar(username: string) : Observable<Blob> {  
      let url: string = this._serviceUrl + "/getavatar/" + username;
      return new Observable(observer => {
        this.http.get(url, 
        { responseType: 'blob', withCredentials: true})
        .pipe(catchError(this.handleError))
        .subscribe( result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
        })
      });
  }

  saveAvatar(fd: FormData, username: string) : Observable<string> {
    let url: string = this._serviceUrl + "/saveavatar/" + username;
    return new Observable(observer => {
      this.http.post(url, fd,
      { withCredentials: true })
      .pipe(catchError(this.handleError))
      .subscribe(result => {
        observer.next(result);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    });
  }
   
  getTravelDocs(username: string): Observable<Array<TravelDoc>> {
    let url: string = this._piServiceUrl + "/TravelDocs/" + username;
    return new Observable(observer => {
      this.http.get<Array<TravelDoc>>(url, 
        { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(results => {
          observer.next(results);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  getAllTravelDocs(ids: Array<number>): Observable<Blob> {
    let url: string = this._piServiceUrl + "/TravelDocs?ids=" + ids.join("&ids=");
    return new Observable(observer => {
      this.http.post(url, ids, {
        responseType: 'blob',
        withCredentials: true
      })
      .pipe(catchError(this.handleError))
      .subscribe(data => {
        observer.next(data);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    });
  }

  deleteTravelDocs(username: string, delCategories: Array<string>): Observable<boolean> {
    let url: string = this._piServiceUrl + "/TravelDocs/Delete/" + username;
    return new Observable(observer => {
      this.http.post(url, delCategories,
        { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(results => {
          observer.next(results);
          observer.complete();
        }, error => {
          observer.error(error);
        })
    });
  }

  saveTravelDoc(fd: FormData, username: string, category: string, description:string) : Observable<string> {
    let url: string = this._piServiceUrl + "/TravelDocs/save/" + username + "/" + category + "/" + description;
    return new Observable(observer => {
      this.http.post(url, fd,
      { withCredentials: true })
      .pipe(catchError(this.handleError))
      .subscribe(result => {
        observer.next(result);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    });
  }

  getBcdEventUpdates(eventID: number): Observable<object> {
    let url: string = this._serviceUrl + "/events/" + eventID.toString();
    return new Observable(observer => {
      this.http.get(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  showPi(): Observable<boolean> {
    let url: string = this._piServiceUrl + "/showPi";
    return new Observable(observer => {
      this.http.get(url, { withCredentials: true })
        .pipe(catchError(this.handleError))
        .subscribe(result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }
}
