import { Injectable, Query } from '@angular/core';
import { InputType, Role, ShowType, Permissions, AttendeeStatus } from './shared/Enums';
import { EventField, EventInfo } from './shared/EventInfo';
import { UserProfile } from './shared/UserProfile';
import { isBoolean } from 'util';
import { FilterParams, QueryParams, SortParams } from './shared/QueryParams';
import { FilterDescriptor, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';


@Injectable()
export class CommonService {

  constructor() { }

  static convertToServiceQueryParams(state:DataStateChangeEvent):QueryParams{
    return <QueryParams> {
        Skip: state.skip,
        Size: state.take,
        Sort: state.sort.map(s => {
          return <SortParams> {
            Field: s.field,
            Desc: s.dir == "desc"
          }
        }),
        Filters: CommonService.getFilterParams(state.filter)
      };
  }

  static getFilterParams(filter:CompositeFilterDescriptor):FilterParams[]{       
    const flatten = (filter) => {
        const filters = (filter || {}).filters;
        if (filters) {
            return filters.reduce((acc, curr) => acc.concat(curr.filters ? flatten(curr) : [curr]), []);
        }
        return [];
    };

    return flatten(filter).map(filter => {
        var fd = filter as FilterDescriptor;
        return <FilterParams>{
            Field: fd.field,
            Operator: fd.operator,
            Value: fd.value
        }
    });
  }

  static getDisplayName(profile: UserProfile): string {
      let name: string;
      if (profile) {
          name = profile.FirstName + " " + profile.LastName;
          if (profile.Segment) {
              name += " (" + profile.Segment + ")";
          }
      }
      return name;
  }

  static getShowTypeString(showtype: ShowType): string {
      switch (showtype) {
          case ShowType.International:
            return "International";
          case ShowType.Domestic:
            return "Domestic";
          default:
            return "";
      }
  }

  static getInputTypeString(input: InputType): string {
    switch (input) {
        case InputType.ShortText:
            return "Short Text";
        case InputType.LongText:
            return "Long Text";
        case InputType.Date:
            return "Date";
        case InputType.YesOrNo:
            return "Select Yes or No";
        case InputType.Select:
            return "Select One";
        case InputType.MultiSelect:
            return "Select Many";
        default:
            return "";
    }
  }

  static getMaskedText(input: string, maxVisibleChars: number): string {
    if (input && input.length > maxVisibleChars) {
      return Array(input.length - maxVisibleChars).join("*") + 
        input.substr(input.length - maxVisibleChars);
    }
    return input;
  }

  static enumToArray(data: Object): Array<number> {
    if (data) {
        return Object.keys(data).filter(
            (type) => !isNaN(<any>type)
        ).map((i) => Number(i));
    }
    return [];
  }

  static makeFieldNameFromLabel(label: string): string {
      let result: string = label;
      if (label) {
          result = result.replace(/\W/g, '');
          result = result.substring(0, Math.min(50, result.length));
      }
      return result;
  }

  static getDefaultEventField(access: Role): EventField {
      return <EventField> {
        ID: 0,
        Label: null,
        Input: InputType.Unknown,
        Source: null,
        Tooltip: null,
        Options: null,
        Order: 0,
        Required: null,
        Included: true,
        Access: access
      };
  }

  static getYesOrNoText(value: any, isNoResponseAllowed: boolean): string {
      if (value) {
          if (isBoolean(value)) {
              return Boolean(value) ? "Yes" : "No";
          }
          switch (value.toString().toUpperCase()) {
              case "YES":
              case "TRUE":
                return "Yes";
              default:
                return "No";
          }
      }
    return isNoResponseAllowed ? "No Resonse" : null;
  }

  static getResponseText(status: AttendeeStatus): string {
      switch (status) {
        case AttendeeStatus.Accepted:
            return "Yes";
        case AttendeeStatus.Declined:
            return "No";
        default:
            return "No Response";
      }
  }

  static canEditOrganizerFields(
      currentUser: UserProfile
    ):boolean{
        if(!currentUser){
            return false;
        }
        return currentUser.Privileges == Permissions.Admin || currentUser.Privileges == Permissions.CreateShows;
  }

  // Permission Checks
  static canEditProfile(
      currentUser: UserProfile,
      profile: UserProfile = null,
      event: EventInfo = null,
      maxRole: Role = Role.All
  ) : boolean {
      if (!currentUser) {
          return false;
      }
      if (currentUser.Privileges == Permissions.Admin) {
          return true;
      }
      if (profile) {
          if (profile.Username == currentUser.Username) {
              return true;
          }
          if (profile.DelegateUsername == currentUser.Username) {
              return true;
          }
      }
      if (event) {
          if (event.OwnerUsername == currentUser.Username) {
              return true;
          }
          if (event.Users.some(u => {
              if (u.User.Username == currentUser.Username &&
                  Role.None != (u.Role & maxRole)) {
                  return true;
              }
          })) {
              return true;
          }
      }
      return false;
  }
  static canViewPassportInfo(
      currentUser: UserProfile,
      profile: UserProfile,
      event: EventInfo = null
  ) : boolean {
      if (event && event.ShowType != ShowType.International) {
          return false;
      }
      if (this.canEditProfile(
          currentUser, profile, event, 
          Role.Lead | Role.Support | Role.Business)) {
          return true;
      }
      return false;
  }
  static canEditEvent(
      currentUser: UserProfile,
      event: EventInfo = null,
      maxRole: Role = Role.Support | Role.Travel
  ) : boolean {
      if (!currentUser) {
          return false;
      }
      if (currentUser.Privileges == Permissions.Admin) {
          return true;
      }
      if (!event) {
          return false;
      }
      if (event.OwnerUsername == currentUser.Username) {
          return true;
      }
      if (event.Users.some(u => {
        if (u.User.Username == currentUser.Username && 
            Role.None != (u.Role & maxRole)) {
            return true;
        }
      })) {
          return true;
      }
      return false;
  }
  static getEventRole(
      currentUser: UserProfile,
      event: EventInfo = null
  ) : Role {
      if (!currentUser) {
          return Role.None;
      }
      if (currentUser.Privileges == Permissions.Admin) {
          return Role.Lead;
      }
      if (event) {
          if (event.OwnerUsername == currentUser.Username) {
              return Role.Lead;
          }
          let role: Role = Role.None;
          if (event.Users.some(u => {
            if (u.User.Username == currentUser.Username) {
                role = u.Role;
                return true;
            }
          })) {
              return role;
          }
      } else if (currentUser.Privileges == Permissions.CreateShows) {
          return Role.Lead;
      }
      return Role.None;
  }
}
