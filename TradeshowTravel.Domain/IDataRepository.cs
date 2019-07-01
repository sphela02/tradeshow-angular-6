using System.Collections.Generic;

namespace TradeshowTravel.Domain
{
    using DTOs;

    public interface IDataRepository
    {
        void SaveImage(string username, byte[] imageByte, string filetype, string category, string description = null);

        //void SaveImages(List<UserImages> doc);

        void DeleteImages(string username, List<string> categories);

        UserImages GetAvatar(string username);

        List<UserImages> GetTravelDocs(string username);

        List<string> GetSegments();

        UserProfile GetProfile(string username, string identityUser = null);

        List<UserProfile> GetProfilesWithPrivileges(Permissions privilege);

        UserProfile GetUserDelegate(string username);

        UserProfile SaveProfile(UserProfile profile);

        Role GetUserRole(int eventID, string username);

        bool HasUserRole(int eventID, string username, Role role);

        EventInfo GetEvent(int eventID);

        EventQueryResult GetEvents(QueryParams parameters, string identityUser = null);

        EventInfo SaveEvent(EventInfo eventInfo);

        void DeleteEvent(int eventID);

        void SaveEventUsers(int eventID, List<EventUser> users);

        EventField GetEventField(int fieldID);

        EventField SaveEventField(int eventID, EventField field);

        void DeleteEventField(int fieldID);

        List<EventField> GetEventFields(int eventID);
        
        void SaveEventFields(int eventID, List<EventField> fields);

        EventAttendeeQueryResult GetEventAttendees(QueryParams parameters, bool includePassportInfo);

        List<EventAttendee> GetEventAttendeesList(QueryParams parameters);

        EventAttendee GetAttendee(int attendeeID);
        bool IsVisaOnProfile(string aUserName);
        bool IsPassportOnProfile(string aUserName);
        bool IsOtherOnProfile(string aUserName);

        EventAttendee GetAttendee(int eventID, string username);

        EventAttendee SaveAttendee(EventAttendee eventAttendee);

        void SaveAttendees(int eventID, List<EventAttendee> eventAttendees);

        void DeleteAttendees(int[] ids);

        AttendeeQueryResult GetAttendeeProfiles(QueryParams parameters, string identityUser = null);
        
        List<AttendeeEvent> GetAttendeeEvents(string username, string identityUser = null);

        bool IsUserNew(string username);
    }
}
