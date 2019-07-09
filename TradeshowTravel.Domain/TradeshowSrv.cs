using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Net;
using System.IO;


namespace TradeshowTravel.Domain
{
    using Common.Logging;
    using DTOs;
    using Telerik.Windows.Documents.Spreadsheet.Model;
    using Telerik.Windows.Documents.Spreadsheet.Model.Shapes;
    using Telerik.Windows.Documents.Media;

    public class TradeshowSrv
    {
        private IDataRepository DataRepo { get; set; }
        private IUserProfileQuery UserSrv { get; set; }
        private EmailSrv EmailSrv { get; set; }

        private readonly string TempFolderRoot = ConfigurationManager.AppSettings["TempFolderRoot"];

        public string CurrentNetworkID { get; set; }
        public string CurrentUsername => CurrentNetworkID.GetUserName();

        public TradeshowSrv(IDataRepository dataRepository, IUserProfileQuery userService)
        {
            DataRepo = dataRepository;
            UserSrv = userService;

            if (HttpContext.Current != null && HttpContext.Current.User != null)
            {
                CurrentNetworkID = HttpContext.Current.User.Identity.Name;
            }

            if (string.IsNullOrWhiteSpace(TempFolderRoot))
            {
                TempFolderRoot = Path.Combine(Path.GetTempPath(), "TradeShowTravel");
            }

            EmailSrv = new EmailSrv(dataRepository,
                ConfigurationManager.AppSettings["SmtpServer"],
                ConfigurationManager.AppSettings["SenderEmailAddress"],
                ConfigurationManager.AppSettings["BaseUrl"],
                TempFolderRoot);
        }

        #region Cache

        protected void CacheSetItem(string key, object value, TimeSpan slidingExpiration)
        {
            if (!string.IsNullOrWhiteSpace(key) && value != null)
            {
                if (HttpContext.Current != null && HttpContext.Current.Cache != null)
                {
                    HttpContext.Current.Cache.Insert(key.ToUpper(), value, null, Cache.NoAbsoluteExpiration, slidingExpiration);
                }
            }
        }
        protected object CacheGetItem(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return null;
            }

            if (HttpContext.Current != null && HttpContext.Current.Cache != null)
            {
                return HttpContext.Current.Cache[key.ToUpper()];
            }

            return null;
        }
        protected bool CacheItemExists(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return false;
            }

            if (HttpContext.Current == null && HttpContext.Current.Cache == null)
            {
                return false;
            }

            return HttpContext.Current.Cache.Get(key.ToUpper()) != null;
        }

        #endregion

        #region Role

        public Role GetCurrentUserRole(int? eventID = null)
        {
            if (CurrentUser != null && CurrentUser.Privileges == Permissions.Admin)
            {
                return Role.Admin;
            }

            if (eventID.HasValue)
            {
                return DataRepo.GetUserRole(eventID.Value, CurrentUsername);
            }

            return Role.None;
        }

        public bool CurrentUserHasRole(Role role, int? eventID = null)
        {
            if (CurrentUser != null && CurrentUser.Privileges == Permissions.Admin)
            {
                return true;
            }

            if (eventID.HasValue)
            {
                return DataRepo.HasUserRole(eventID.Value, CurrentUsername, role);
            }

            return false;
        }

        #endregion

        #region User Images

        public UserImages GetAvatar(string username)
        {
            return DataRepo.GetAvatar(username);
        }

        public ValidationResponse<bool> DeleteImages(string username, List<string> categories)
        {
            if (categories == null || categories.Count == 0)
            {
                return ValidationResponse<bool>.CreateSuccess(true);
            }

            // Make sure user profile exists and user has privs to delete images
            // Assumption that username is the same for all objects
            UserProfile userprofilerec = GetProfile(username.ToUpper());
            if (userprofilerec == null)
            {
                return ValidationResponse<bool>.CreateFailure("User profile was not found.  Must exist to remove images.");
            }
            else
            {

                if (GetCurrentUserRole() != Role.Admin)
                {
                    if (userprofilerec.Username.ToUpper() != username.ToUpper())
                    {
                        return ValidationResponse<bool>.CreateFailure($"User '{username}' does not have permission to remove images.");
                    }
                }
            }

            try
            {
                this.DataRepo.DeleteImages(username, categories);
                return ValidationResponse<bool>.CreateSuccess(true);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error removing images '{username}'.  Ex: {ex}");
                return ValidationResponse<bool>.CreateFailure($"Error removing images for (username={username})");
            }
        }

        public ValidationResponse<bool> SaveImage(string username, HttpPostedFile file, string category, string description)
        {

            // Validate username
            if (string.IsNullOrWhiteSpace(username))
            {
                return ValidationResponse<bool>.CreateFailure("Username is required.");
            }

            // Make sure user profile exists and user has privs to save user profile pic
            UserProfile userprofilerec = GetProfile(username.ToUpper());
            if (userprofilerec == null)
            {
                return ValidationResponse<bool>.CreateFailure("User profile was not found.  Must exist to add a image.");
            }
            else
            {
                if (GetCurrentUserRole() != Role.Admin)
                {
                    if (userprofilerec.Username.ToUpper() != username.ToUpper())
                    {
                        return ValidationResponse<bool>.CreateFailure($"User '{username}' does not have permission to edit the profile images.");
                    }
                }
            }

            try
            {
                if (file != null && file.ContentLength > 0)
                {
                    string filetype = file.ContentType;
                    int imagelength = file.ContentLength;
                    byte[] picbyte = new byte[imagelength];
                    file.InputStream.Read(picbyte, 0, imagelength);

                    this.DataRepo.SaveImage(username.ToUpper(), picbyte, filetype, category, description);

                    return ValidationResponse<bool>.CreateSuccess(true);
                }
                else
                {
                    return ValidationResponse<bool>.CreateFailure("User image is required.");
                }
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving the image '{category}' for '{username}'.  Ex: {ex}");
                return ValidationResponse<bool>.CreateFailure($"Error saving the image '{category}' for (username={username})");
            }
        }

        public ValidationResponse<List<UserImages>> GetTravelDocs(string username)
        {
            List<UserImages> result = null;

            try
            {
                result = DataRepo.GetTravelDocs(username);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error querying user images. Ex: {ex}");
                return ValidationResponse<List<UserImages>>.CreateFailure("Error querying user images.");
            }

            return ValidationResponse<List<UserImages>>.CreateSuccess(result);
        }

        public ValidationResponse<List<UserImages>> GetAttendeeDocuments(int[] ids)
        {
            try
            {
                return ValidationResponse<List<UserImages>>.CreateSuccess(DataRepo.GetTravelDocs(ids));
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error querying user images. Ex: {ex}");
                return ValidationResponse<List<UserImages>>.CreateFailure("Error querying user images.");
            }
        }

        #endregion


        #region User

        public List<UserInfo> GetUsers(string username, string name, int size = 15, int skip = 0)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                name = name.Trim().ToLower();

                string[] names = name.Split(new char[] { ',' }, 2);

                if (names.Length == 2)
                {
                    return UserSrv.GetUsers(null, names[0], names[1], size, skip);
                }

                names = name.Split(new char[] { ' ' }, 2);

                if (names.Length == 2)
                {
                    return UserSrv.GetUsers(null, names[1], names[0], size, skip);
                }

                return UserSrv.GetUsers(null, name, name, size, skip);
            }

            return UserSrv.GetUsers(username, null, null, size, skip);
        }

        public List<string> GetSegments()
        {
            return DataRepo.GetSegments();
        }

        public UserProfile CurrentUser
        {
            get { return GetProfile(CurrentUsername); }
        }

        public UserProfile GetProfile(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            if (CacheItemExists(username))
            {
                return CacheGetItem(username) as UserProfile;
            }

            UserProfile profile = DataRepo.GetProfile(username);

            if (profile == null)
            {
                profile = UserSrv.GetProfile(username);
            }

            if (username.Equals(CurrentUsername, StringComparison.CurrentCultureIgnoreCase))
            {
                CacheSetItem(username, profile, TimeSpan.FromMinutes(5.0));
            }

            return profile;
        }

        protected UserProfile GetOrCreateProfile(string username)
        {
            UserProfile profile = this.DataRepo.GetProfile(username);

            if (profile != null)
            {
                return profile;
            }

            profile = this.UserSrv.GetProfile(username);

            if (profile == null)
            {
                return null;
            }

            try
            {
                this.DataRepo.SaveProfile(profile);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving the profile for {username}.  Ex: {ex}");
                return null;
            }

            return profile;
        }

        public ValidationResponse<UserProfile> GetUserProfile(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return ValidationResponse<UserProfile>.CreateFailure("The username is required.");
            }

            username = username.Trim().ToUpper();

            if (username == CurrentUsername && CurrentUser != null)
            {
                return ValidationResponse<UserProfile>.CreateSuccess(CurrentUser);
            }

            string identityUser = null;
            if (GetCurrentUserRole() != Role.Admin)
            {
                identityUser = CurrentUsername;
            }


            UserProfile profile = null;
            try
            {
                profile = DataRepo.GetProfile(username, identityUser);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error getting profile for {username}. Ex: {ex}");
                return ValidationResponse<UserProfile>.CreateFailure($"Error getting profile for {username}.");
            }

            if (profile == null)
            {
                return ValidationResponse<UserProfile>.CreateFailure($"The username '{username}' was not found.");
            }

            return ValidationResponse<UserProfile>.CreateSuccess(profile);
        }

        public ValidationResponse<UserInfo> GetDelegate(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return ValidationResponse<UserInfo>.CreateFailure("The username was not found.");
            }

            UserProfile profile = null;

            if (username.Equals(CurrentUsername, StringComparison.CurrentCultureIgnoreCase))
            {
                if ((profile = CacheGetItem(username) as UserProfile) != null)
                {
                    return ValidationResponse<UserInfo>.CreateSuccess(profile.Delegate);
                }
            }

            profile = DataRepo.GetProfile(username);

            if (profile == null)
            {
                return ValidationResponse<UserInfo>.CreateSuccess(null);
            }

            return ValidationResponse<UserInfo>.CreateSuccess(profile.Delegate);
        }

        public ValidationResponse<UserProfile> SaveProfile(UserProfile profile)
        {
            if (profile == null)
            {
                return ValidationResponse<UserProfile>.CreateFailure("The profile is required.");
            }

            if (string.IsNullOrWhiteSpace(profile.Username))
            {
                return ValidationResponse<UserProfile>.CreateFailure("The username is required.");
            }

            profile.Username = profile.Username.Trim().ToUpper();

            foreach (var propname in UserProfile.PROFILE_REQ_FIELDS)
            {
                if (!profile.IsCompleted(propname))
                {
                    return ValidationResponse<UserProfile>.CreateFailure($"The {propname} is required.");
                }
            }

            bool hasUserDelegateChanged = false;

            // Validate delegate if specified.
            if (!string.IsNullOrWhiteSpace(profile.DelegateUsername))
            {
                profile.DelegateUsername = profile.DelegateUsername.Trim().ToUpper();

                var del = this.GetOrCreateProfile(profile.DelegateUsername);

                if (del == null)
                {
                    return ValidationResponse<UserProfile>.CreateFailure(
                        $"The delegate '{profile.DelegateUsername}' was not found."
                        );
                }
                else if (profile.Username.Equals(del.DelegateUsername))
                {
                    return ValidationResponse<UserProfile>.CreateFailure(
                        $"the delegate '{profile.DelegateUsername}' is already one for '{profile.Username}'."
                        );
                }

                var response = GetDelegate(profile.Username);

                if (!response.Success || response.Result == null)
                {
                    hasUserDelegateChanged = true;
                }
                else if (!response.Result.Username.Equals(del.Username, StringComparison.CurrentCultureIgnoreCase))
                {
                    hasUserDelegateChanged = true;
                }
            }

            // Validate save is done by authorized user.
            if (GetCurrentUserRole() != Role.Admin)
            {
                if (!CurrentUsername.Equals(profile.Username) && !CurrentUsername.Equals(profile.DelegateUsername))
                {
                    // Check if current user is part of a show user group
                    if (!CurrentUser.Role.HasFlag(Role.Lead) && !CurrentUser.Role.HasFlag(Role.Support))
                    {
                        return ValidationResponse<UserProfile>.CreateFailure(
                            $"User '{CurrentUsername}' does not have permissions to modify the profile for {profile.Username}."
                            );
                    }
                }
            }

            try
            {
                profile = DataRepo.SaveProfile(profile);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving the profile for {profile.Username}.  Ex: {ex}");
                return ValidationResponse<UserProfile>.CreateFailure(
                    $"Error saving the profile for {profile.Username}"
                    );
            }

            if (CacheItemExists(profile.Username))
            {
                CacheSetItem(profile.Username, profile, TimeSpan.FromMinutes(5.0));
            }

            if (hasUserDelegateChanged)
            {
                // TODO: Send delegate notification
                EmailSrv.SendDelegateNotification(profile);
                Logging.LogMessage(LogLevel.DebugBasic, $"Send delegate email to '{profile.DelegateUsername}'.");
            }

            return ValidationResponse<UserProfile>.CreateSuccess(profile);
        }

        public ValidationResponse<List<UserProfile>> GetPrivilegedUsers(Permissions privilege)
        {
            try
            {
                return ValidationResponse<List<UserProfile>>.CreateSuccess(
                    DataRepo.GetProfilesWithPrivileges(privilege)
                    );
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error getting user profiles.  Ex: {ex}");
                return ValidationResponse<List<UserProfile>>.CreateFailure("Error getting user profiles.");
            }
        }

        public ValidationResponse<bool> SavePrivilegedUsers(Permissions privilege, List<string> usernames)
        {
            if (GetCurrentUserRole() != Role.Admin)
            {
                return ValidationResponse<bool>.CreateFailure($"{CurrentUsername} may not set user permissions.");
            }

            if (privilege == Permissions.None)
            {
                return ValidationResponse<bool>.CreateSuccess(true);
            }

            if (usernames == null || usernames.Count == 0)
            {
                return ValidationResponse<bool>.CreateFailure("One or more usernames are required.");
            }

            foreach (var username in usernames)
            {
                UserProfile profile = GetProfile(username);

                if (profile == null)
                {
                    return ValidationResponse<bool>.CreateFailure($"The username '{username}' was not found.");
                }

                profile.Privileges |= privilege;

                try
                {
                    DataRepo.SaveProfile(profile);
                }
                catch (Exception ex)
                {
                    Logging.LogMessage(LogLevel.Error, $"Error saving privileged user '{username}'.  Ex: {ex}");
                    return ValidationResponse<bool>.CreateFailure($"Error saving privileged user '{username}'.");
                }
            }

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        public ValidationResponse<bool> RemovePrivilegedUser(Permissions privilege, string username)
        {
            if (GetCurrentUserRole() != Role.Admin)
            {
                return ValidationResponse<bool>.CreateFailure($"{CurrentUsername} may not remove user permissions.");
            }

            if (privilege == Permissions.None)
            {
                return ValidationResponse<bool>.CreateSuccess(true);
            }

            if (string.IsNullOrWhiteSpace(username))
            {
                return ValidationResponse<bool>.CreateFailure("username is required.");
            }

            UserProfile profile = GetProfile(username);

            if (profile == null)
            {
                return ValidationResponse<bool>.CreateSuccess(true);
            }

            profile.Privileges &= ~privilege;

            try
            {
                profile = DataRepo.SaveProfile(profile);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error removing {privilege} from user '{username}'.  Ex: {ex}");
                return ValidationResponse<bool>.CreateFailure($"Error removing {privilege} from user '{username}'.");
            }

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        #endregion

        #region Events

        public ValidationResponse<EventInfo> GetEvent(int eventID)
        {
            var evt = DataRepo.GetEvent(eventID);

            if (evt == null)
            {
                return ValidationResponse<EventInfo>.CreateFailure($"Event {eventID} was not found.");
            }

            // Validate user access to event.
            if (GetCurrentUserRole() != Role.Admin)
            {
                if (!evt.OwnerUsername.Equals(CurrentUsername, StringComparison.CurrentCultureIgnoreCase))
                {
                    if (!evt.Users.Any(u => u.User.Username.Equals(CurrentUsername, StringComparison.CurrentCultureIgnoreCase)))
                    {
                        //return ValidationResponse<EventInfo>.CreateFailure($"User {CurrentUsername} does not have permission to access event {eventID}.");
                    }
                }
            }

            return ValidationResponse<EventInfo>.CreateSuccess(evt);
        }

        public ValidationResponse<EventQueryResult> GetEvents(QueryParams parameters = null)
        {
            if (parameters == null)
            {
                parameters = new QueryParams();
            }

            parameters.Skip = Math.Max(parameters.Skip, 0);
            parameters.Size = Math.Max(parameters.Size, 25);

            string identityUser = null;

            if (GetCurrentUserRole() != Role.Admin)
            {
                identityUser = CurrentUsername;
            }

            EventQueryResult result = null;

            try
            {
                result = DataRepo.GetEvents(parameters, identityUser);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error querying events. Ex: {ex}");
                return ValidationResponse<EventQueryResult>.CreateFailure("Error querying events.");
            }

            return ValidationResponse<EventQueryResult>.CreateSuccess(result);
        }

        public ValidationResponse<EventInfo> SaveEvent(EventInfo eventInfo)
        {
            // Validate event info
            if (eventInfo == null)
            {
                return ValidationResponse<EventInfo>.CreateFailure("The event is required.");
            }

            if (string.IsNullOrWhiteSpace(eventInfo.Name))
            {
                return ValidationResponse<EventInfo>.CreateFailure("The event name is required.");
            }

            if (eventInfo.StartDate == DateTime.MinValue || eventInfo.StartDate == DateTime.MaxValue)
            {
                return ValidationResponse<EventInfo>.CreateFailure("The start date is required.");
            }

            if (eventInfo.EndDate == DateTime.MinValue || eventInfo.EndDate == DateTime.MaxValue)
            {
                return ValidationResponse<EventInfo>.CreateFailure("The end date is required.");
            }

            if (eventInfo.StartDate > eventInfo.EndDate)
            {
                return ValidationResponse<EventInfo>.CreateFailure("Incorrect start and end date range.");
            }

            if (eventInfo.RsvpDueDate.HasValue)
            {
                if (eventInfo.RsvpDueDate.Value > eventInfo.StartDate)
                {
                    return ValidationResponse<EventInfo>.CreateFailure("RSVP date must be prior to the start date.");
                }
            }

            EventInfo existingEvent = DataRepo.GetEvent(eventInfo.ID);

            if (existingEvent == null)
            {
                if (CurrentUser == null || !CurrentUser.Privileges.HasFlag(Permissions.CreateShows))
                {
                    return ValidationResponse<EventInfo>.CreateFailure(
                        $"User '{CurrentUsername}' does not have permission to create new events."
                        );
                }

                if (eventInfo.StartDate < DateTime.Now)
                {
                    return ValidationResponse<EventInfo>.CreateFailure("The start date has already passed.");
                }

                if (eventInfo.EndDate < DateTime.Now)
                {
                    return ValidationResponse<EventInfo>.CreateFailure("The end date has already passed.");
                }

                if (string.IsNullOrWhiteSpace(eventInfo.OwnerUsername))
                {
                    if (string.IsNullOrWhiteSpace(eventInfo.OwnerUsername = CurrentUsername))
                    {
                        return ValidationResponse<EventInfo>.CreateFailure("The event owner is required.");
                    }
                }

                // Make sure owner's profile exists
                eventInfo.OwnerUsername = eventInfo.OwnerUsername.ToUpper();

                UserProfile owner = GetOrCreateProfile(eventInfo.OwnerUsername);

                if (owner == null)
                {
                    return ValidationResponse<EventInfo>.CreateFailure(
                        $"The event owner username '{eventInfo.OwnerUsername}' was not found."
                        );
                }
            }
            else
            {
                if (GetCurrentUserRole() != Role.Admin)
                {
                    if (!existingEvent.OwnerUsername.Equals(CurrentUsername, StringComparison.CurrentCultureIgnoreCase))
                    {
                        if (!existingEvent.Users.Any(u => u.Role != Role.Business &&
                                u.User.Username.Equals(CurrentUsername, StringComparison.CurrentCultureIgnoreCase)))
                        {
                            return ValidationResponse<EventInfo>.CreateFailure(
                                $"User '{CurrentUsername}' does not have permission to edit this event."
                                );
                        }
                    }
                }

                // Make sure owner's profile exists if it changed
                if (!string.IsNullOrWhiteSpace(eventInfo.OwnerUsername))
                {
                    if (!existingEvent.OwnerUsername.Equals(eventInfo.OwnerUsername, StringComparison.CurrentCultureIgnoreCase))
                    {
                        eventInfo.OwnerUsername = eventInfo.OwnerUsername.ToUpper();

                        UserProfile owner = GetOrCreateProfile(eventInfo.OwnerUsername);

                        if (owner == null)
                        {
                            return ValidationResponse<EventInfo>.CreateFailure(
                                $"The event owner username '{eventInfo.OwnerUsername}' was not found."
                                );
                        }
                    }
                }
            }

            // Make sure event user profiles exist
            if (eventInfo.Users != null)
            {
                foreach (var tu in eventInfo.Users)
                {
                    if (tu.User == null || string.IsNullOrWhiteSpace(tu.User.Username))
                    {
                        continue;
                    }

                    string username = tu.User.Username.Trim().ToUpper();

                    UserProfile user = GetOrCreateProfile(username);

                    if (user == null)
                    {
                        return ValidationResponse<EventInfo>.CreateFailure($"The event user '{username}' was not found.");
                    }
                }
            }

            try
            {
                eventInfo = DataRepo.SaveEvent(eventInfo);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving the event '{eventInfo.Name}' ({eventInfo.ID}).  Ex: {ex}");
                return ValidationResponse<EventInfo>.CreateFailure($"Error saving the event (ID={eventInfo.ID})");
            }

            if (existingEvent == null)
            {
                // TODO: Send new event email.
                EmailSrv.SendNewEventNotifications(eventInfo);
                Logging.LogMessage(LogLevel.DebugBasic, $"Send new event email to team.");
            }

            return ValidationResponse<EventInfo>.CreateSuccess(eventInfo);
        }

        public ValidationResponse<bool> DeleteEvent(int eventID)
        {
            // Validate user permissions to delete event
            if (!CurrentUserHasRole(Role.Lead, eventID))
            {
                return ValidationResponse<bool>.CreateFailure(
                    $"User '{CurrentUsername}' does not have permission to delete this event."
                    );
            }

            try
            {
                DataRepo.DeleteEvent(eventID);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error deleting event {eventID}.  Ex: {ex}");
                return ValidationResponse<bool>.CreateFailure($"Error deleting event {eventID}.");
            }

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        public ValidationResponse<bool> SaveEventUsers(int eventID, List<EventUser> users)
        {
            if (users == null)
            {
                return ValidationResponse<bool>.CreateFailure("The event users are required.");
            }

            Role role = GetCurrentUserRole(eventID);

            if (role != Role.Admin)
            {
                if (!role.HasFlag(Role.Lead) && !role.HasFlag(Role.Support))
                {
                    return ValidationResponse<bool>.CreateFailure($"User '{CurrentUsername}' does not have permission to change users for event {eventID}.");
                }
            }

            // Make sure event user profiles exist
            foreach (var tu in users)
            {
                if (tu.User == null || string.IsNullOrWhiteSpace(tu.User.Username))
                {
                    continue;
                }

                string username = tu.User.Username.Trim().ToUpper();

                UserProfile user = GetOrCreateProfile(username);

                if (user == null)
                {
                    return ValidationResponse<bool>.CreateFailure($"The event user '{username}' was not found.");
                }
            }

            try
            {
                DataRepo.SaveEventUsers(eventID, users);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving event users for event ID: {eventID}.  Ex: {ex}");
                return ValidationResponse<bool>.CreateFailure($"Error saving event users for event ID: {eventID}");
            }

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        public ValidationResponse<List<EventField>> GetEventFields(int eventID)
        {
            try
            {
                return ValidationResponse<List<EventField>>.CreateSuccess(
                    DataRepo.GetEventFields(eventID)
                    );
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error getting fields for event ID: {eventID}.  Ex: {ex}");

                return ValidationResponse<List<EventField>>.CreateFailure(
                    $"Error getting fields for event ID: {eventID}"
                    );
            }
        }

        public ValidationResponse<bool> SaveEventFields(int eventID, List<EventField> fields)
        {
            if (fields == null)
            {
                return ValidationResponse<bool>.CreateFailure("The event fields are required.");
            }

            var evt = DataRepo.GetEvent(eventID);

            if (evt == null)
            {
                return ValidationResponse<bool>.CreateFailure($"Event {eventID} was not found.");
            }

            // Check permissions
            if (CurrentUser.Privileges != Permissions.Admin)
            {
                Role role = evt.GetUserRole(CurrentUsername);

                if (!role.HasFlag(Role.Lead) &&
                    !role.HasFlag(Role.Support) &&
                    !role.HasFlag(Role.Travel))
                {
                    return ValidationResponse<bool>.CreateFailure($"User '{CurrentUsername}' does not have permission to modify fields of event {eventID}.");
                }
            }

            bool hasNewRequiredFields = false;
            bool hasRequiredFieldsChanged = false;

            foreach (var field in fields)
            {
                if (string.IsNullOrWhiteSpace(field.Label))
                {
                    return ValidationResponse<bool>.CreateFailure($"One or more field labels were not specified.");
                }

                if (field.Input == InputType.Unknown)
                {
                    return ValidationResponse<bool>.CreateFailure($"One or more field response types were not specified.");
                }

                bool nowRequired = field.Included && field.Required;
                bool wasRequired = false;

                int index = evt.Fields.FindIndex(f => f.ID == field.ID);

                if (index >= 0)
                {
                    wasRequired = evt.Fields[index].Included && evt.Fields[index].Required;
                }

                if (nowRequired != wasRequired && field.Access.HasFlag(Role.Attendee))
                {
                    hasRequiredFieldsChanged = true;
                    hasNewRequiredFields |= nowRequired;
                }
            }

            try
            {
                DataRepo.SaveEventFields(eventID, fields);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving fields for event ID: {eventID}.  Ex: {ex}");
                return ValidationResponse<bool>.CreateFailure($"Error saving fields for event ID: {eventID}");
            }

            if (hasRequiredFieldsChanged)
            {
                evt.Fields = DataRepo.GetEventFields(eventID);

                onEventFieldsChanged(evt, hasNewRequiredFields);
            }

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        public ValidationResponse<EventField> SaveEventField(int eventID, EventField field)
        {
            if (field == null)
            {
                return ValidationResponse<EventField>.CreateFailure("The event field is required.");
            }

            if (string.IsNullOrWhiteSpace(field.Label))
            {
                return ValidationResponse<EventField>.CreateFailure($"Field label required.");
            }

            if (field.Input == InputType.Unknown)
            {
                return ValidationResponse<EventField>.CreateFailure($"Input type required.");
            }

            var evt = DataRepo.GetEvent(eventID);

            if (evt == null)
            {
                return ValidationResponse<EventField>.CreateFailure($"Event {eventID} was not found.");
            }

            // Check permissions
            if (CurrentUser.Privileges != Permissions.Admin)
            {
                Role role = evt.GetUserRole(CurrentUsername);

                if (!role.HasFlag(Role.Lead) &&
                    !role.HasFlag(Role.Support) &&
                    !role.HasFlag(Role.Travel))
                {
                    return ValidationResponse<EventField>.CreateFailure($"User '{CurrentUsername}' does not have permission to modify fields of event {eventID}.");
                }
            }

            bool nowRequired = field.Included && field.Required;
            bool wasRequired = false;

            int index = evt.Fields.FindIndex(f => f.ID == field.ID);

            if (index >= 0)
            {
                wasRequired = evt.Fields[index].Included && evt.Fields[index].Required;
            }

            try
            {
                field = DataRepo.SaveEventField(eventID, field);

                if (index < 0)
                {
                    evt.Fields.Add(field);
                }
                else
                {
                    evt.Fields[index] = field;
                }
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving fields for event ID: {eventID}.  Ex: {ex}");
                return ValidationResponse<EventField>.CreateFailure($"Error saving fields for event ID: {eventID}");
            }

            if (nowRequired != wasRequired && field.Access.HasFlag(Role.Attendee))
            {
                onEventFieldsChanged(evt, nowRequired);
            }

            return ValidationResponse<EventField>.CreateSuccess(field);
        }

        public ValidationResponse<bool> DeleteEventField(int eventID, int fieldID)
        {
            var evt = DataRepo.GetEvent(eventID);

            if (evt == null)
            {
                return ValidationResponse<bool>.CreateFailure($"Event {eventID} was not found.");
            }

            // Check permissions
            if (CurrentUser.Privileges != Permissions.Admin)
            {
                Role role = evt.GetUserRole(CurrentUsername);

                if (!role.HasFlag(Role.Lead) &&
                    !role.HasFlag(Role.Support) &&
                    !role.HasFlag(Role.Travel))
                {
                    return ValidationResponse<bool>.CreateFailure($"User '{CurrentUsername}' does not have permission to delete fields of event {eventID}.");
                }
            }

            try
            {
                DataRepo.DeleteEventField(fieldID);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error deleting field for event ID: {eventID}.  Ex: {ex}");
                return ValidationResponse<bool>.CreateFailure($"Error deleting field for event ID: {eventID}");
            }

            evt.Fields.RemoveAll(f => f.ID == fieldID);

            onEventFieldsChanged(evt);

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        public ValidationResponse<string> UploadAttachment(int eventID, HttpPostedFile attachment)
        {
            string folder = Path.Combine(TempFolderRoot, eventID.ToString());
            string filePath = Path.Combine(folder, attachment.FileName);

            bool success = true;

            try
            {
                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                if (!File.Exists(filePath))
                {
                    using (var fileStream = File.Create(filePath))
                    {
                        attachment.InputStream.CopyTo(fileStream);
                    }
                }

                // after creating the file check if it exists
                if (!File.Exists(filePath))
                {
                    success = false;
                }
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving the attacment '{attachment.FileName}' for event: {eventID}.  Ex: {ex}");
                success = false;
            }

            return success
                ? ValidationResponse<string>.CreateSuccess(filePath)
                : ValidationResponse<string>.CreateFailure($"Attachment {attachment.FileName} did not save.");
        }

        public ValidationResponse<bool> SendRSVPRequests(int eventID, RsvpRequest req)
        {
            if (req == null)
            {
                return ValidationResponse<bool>.CreateFailure($"Rsvp request was not specified.");
            }

            var evt = DataRepo.GetEvent(eventID);

            if (evt == null)
            {
                return ValidationResponse<bool>.CreateFailure($"The event {eventID} does not exist.");
            }

            if (evt.StartDate < DateTime.Now)
            {
                return ValidationResponse<bool>.CreateFailure($"The event {eventID} has already passed.");
            }

            // Check permissions
            if (CurrentUser.Privileges != Permissions.Admin)
            {
                Role role = evt.GetUserRole(CurrentUsername);

                if (!role.HasFlag(Role.Lead) &&
                    !role.HasFlag(Role.Support) &&
                    !role.HasFlag(Role.Travel))
                {
                    return ValidationResponse<bool>.CreateFailure($"User '{CurrentUsername}' does not have permission to send RSVP requests for event {eventID}.");
                }
            }

            // Did the RSVP Due Date change?
            if (evt.RsvpDueDate != req.DueDate)
            {
                if (req.DueDate > evt.StartDate)
                {
                    return ValidationResponse<bool>.CreateFailure($"The RSVP due date must preceed the event start date.");
                }

                evt.RsvpDueDate = req.DueDate;

                try
                {
                    DataRepo.SaveEvent(evt);
                }
                catch (Exception ex)
                {
                    Logging.LogMessage(LogLevel.Error, $"Error saving the RSVP due date for event: {eventID}.  Ex: {ex}");
                    return ValidationResponse<bool>.CreateFailure($"Error saving the RSVP due date for event: {eventID}");
                }
            }

            // Get the attendees, sending out the rsvp request and updating the RSVP sent date.

            QueryParams parameters = new QueryParams();
            parameters.Filters = new List<FilterParams>();

            // filter for this event
            parameters.Filters.Add(new FilterParams
            {
                Field = "TradeshowID",
                Operator = "eq",
                Value = eventID.ToString()
            });

            // filter for Pending status
            parameters.Filters.Add(new FilterParams
            {
                Field = "Status",
                Operator = "eq",
                Value = AttendeeStatus.Pending.ToString()
            });

            // filter for Invited status
            parameters.Filters.Add(new FilterParams
            {
                Field = "Status",
                Operator = "eq",
                Value = AttendeeStatus.Invited.ToString()
            });

            // filter for ids
            foreach (int id in req.AttendeeIDs)
            {
                parameters.Filters.Add(new FilterParams
                {
                    Field = "ID",
                    Operator = "eq",
                    Value = id.ToString()
                });
            }

            List<EventAttendee> attendees = DataRepo.GetEventAttendeesList(parameters);

            DateTime timestamp = DateTime.Now;

            foreach (var attendee in attendees)
            {
                // Send welcome package is user has not been invited to an event
                if(DataRepo.IsUserNew(attendee.Username))
                {
                    EmailSrv.SendNewUser(evt, attendee);
                    Logging.LogMessage(LogLevel.DebugBasic, $"Send Welcome notification to {attendee.Username}.");
                }

                // TODO: Replace email text placeholders with object property values
                // TODO: Send email to attendee and update RSVP date
                EmailSrv.SendRSVP(evt, attendee, req);
                Logging.LogMessage(LogLevel.DebugBasic, $"Send RSVP notification to {attendee.Username} for event {eventID}.");
                attendee.SendRSVP = true;
                attendee.DateRSVP = timestamp;
            }

            try
            {
                DataRepo.SaveAttendees(eventID, attendees);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error saving RSVP due date for attendees: {String.Join(", ", req.AttendeeIDs)}.  Ex: {ex}");
                return ValidationResponse<bool>.CreateSuccess(false);
            }

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        public ValidationResponse<bool> SendReminderRequest(int eventID, ReminderRequest req)
        {
            if (req == null)
            {
                return ValidationResponse<bool>.CreateFailure($"Reminder request was not specified.");
            }

            var evt = DataRepo.GetEvent(eventID);

            if (evt == null)
            {
                return ValidationResponse<bool>.CreateFailure($"The event {eventID} does not exist.");
            }

            if (evt.StartDate < DateTime.Now)
            {
                return ValidationResponse<bool>.CreateFailure($"The event {eventID} has already passed.");
            }

            // Check permissions
            if (CurrentUser.Privileges != Permissions.Admin)
            {
                Role role = evt.GetUserRole(CurrentUsername);

                if (!role.HasFlag(Role.Lead) &&
                    !role.HasFlag(Role.Support) &&
                    !role.HasFlag(Role.Travel))
                {
                    return ValidationResponse<bool>.CreateFailure($"User '{CurrentUsername}' does not have permission to send reminders for event {eventID}.");
                }
            }

            // Get the attendees, sending out the reminder request.

            QueryParams parameters = new QueryParams();
            parameters.Filters = new List<FilterParams>();

            // filter for this event
            parameters.Filters.Add(new FilterParams
            {
                Field = "TradeshowID",
                Operator = "eq",
                Value = eventID.ToString()
            });

            // filter for ids
            foreach (int id in req.AttendeeIDs)
            {
                parameters.Filters.Add(new FilterParams
                {
                    Field = "ID",
                    Operator = "eq",
                    Value = id.ToString()
                });
            }

            List<EventAttendee> attendees = DataRepo.GetEventAttendeesList(parameters);

            // TODO: Replace email text placeholders with object property values
            // TODO: Add everyone to one email? doesn't seem to be attendee specific.
            EmailSrv.SendReminderNotifications(evt, attendees, req);
            Logging.LogMessage(LogLevel.DebugBasic, $"Send reminder notification to {String.Join(", ", req.AttendeeIDs)} for event {eventID}.");

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        public ValidationResponse<EventAttendeeQueryResult> GetEventAttendees(int eventID, QueryParams parameters = null)
        {
            Role role = GetCurrentUserRole(eventID);

            if (role == Role.Attendee || role == Role.None)
            {
                return ValidationResponse<EventAttendeeQueryResult>.CreateSuccess(new EventAttendeeQueryResult());
            }

            if (parameters == null)
            {
                parameters = new QueryParams();
            }

            parameters.Skip = Math.Max(parameters.Skip, 0);
            parameters.Size = Math.Max(parameters.Size, 25);

            if (parameters.Filters == null)
            {
                parameters.Filters = new List<FilterParams>();
            }

            // filter for event
            parameters.Filters.Add(new FilterParams
            {
                Field = "TradeshowID",
                Operator = "eq",
                Value = eventID.ToString()
            });

            EventAttendeeQueryResult result = null;

            try
            {
                result = DataRepo.GetEventAttendees(parameters, role != Role.Travel);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error querying event attendees. Ex: {ex}");
                return ValidationResponse<EventAttendeeQueryResult>.CreateFailure("Error querying event attendees.");
            }

            return ValidationResponse<EventAttendeeQueryResult>.CreateSuccess(result);
        }

        public ValidationResponse<EventAttendee> GetEventAttendee(int attendeeID)
        {
            if (attendeeID < 1)
            {
                return ValidationResponse<EventAttendee>.CreateFailure($"The attendee {attendeeID} was not found.");
            }

            var attendee = DataRepo.GetAttendee(attendeeID);

            if (attendee == null)
            {
                return ValidationResponse<EventAttendee>.CreateFailure($"The attendee '{attendeeID}' does not exist.");
            }

            attendee.Event = DataRepo.GetEvent(attendee.EventID);

            if (attendee.Event == null)
            {
                return ValidationResponse<EventAttendee>.CreateFailure($"The event {attendee.EventID} does not exist.");
            }

            // Check permissions
            if (CurrentUser.Privileges != Permissions.Admin)
            {
                if (!CurrentUsername.Equals(attendee.Username) &&
                    !CurrentUsername.Equals(attendee.Profile.DelegateUsername))
                {
                    Role role = attendee.Event.GetUserRole(CurrentUsername);

                    if (!role.HasFlag(Role.Lead) &&
                        !role.HasFlag(Role.Support) &&
                        !role.HasFlag(Role.Travel))
                    {
                        return ValidationResponse<EventAttendee>.CreateFailure($"User '{CurrentUsername}' does not have permission to access attendees of event {attendee.EventID}.");
                    }

                    if (role == Role.Travel)
                    {
                        // Hide Passport Info
                        attendee.Profile.HidePassportInfo();
                    }
                }
            }

            return ValidationResponse<EventAttendee>.CreateSuccess(attendee);
        }

        public ValidationResponse<EventAttendee> SaveAttendee(int eventID, EventAttendee eventAttendee)
        {
            ValidationResponse<List<EventAttendee>> response = SaveAttendees(
                eventID, new List<EventAttendee> { eventAttendee }
                );

            if (response.Success)
            {
                return ValidationResponse<EventAttendee>.CreateSuccess(response.Result[0]);
            }
            else
            {
                return ValidationResponse<EventAttendee>.CreateFailure(response.Message);
            }
        }

        public ValidationResponse<List<EventAttendee>> SaveAttendees(int eventID, List<EventAttendee> eventAttendees)
        {
            if (eventAttendees == null || eventAttendees.Count == 0)
            {
                return ValidationResponse<List<EventAttendee>>.CreateFailure("Event attendees are not specified.");
            }

            var evt = DataRepo.GetEvent(eventID);

            if (evt == null)
            {
                return ValidationResponse<List<EventAttendee>>.CreateFailure($"Event {eventID} was not found.");
            }

            Role currentRole = evt.GetUserRole(CurrentUsername);

            int newAttendeeCount = 0;

            for (int i = 0; i < eventAttendees.Count; ++i)
            {
                var attendee = eventAttendees[i];

                attendee.Event = evt;

                if (string.IsNullOrWhiteSpace(attendee.Username))
                {
                    return ValidationResponse<List<EventAttendee>>.CreateFailure("One or more attendee usernames were not specified.");
                }

                // Check permissions
                if (CurrentUser.Privileges != Permissions.Admin)
                {
                    if (!CurrentUsername.Equals(attendee.Username, StringComparison.CurrentCultureIgnoreCase) &&
                        !CurrentUsername.Equals(attendee.Profile.DelegateUsername, StringComparison.CurrentCultureIgnoreCase))
                    {
                        if (!currentRole.HasFlag(Role.Lead) &&
                            !currentRole.HasFlag(Role.Support) &&
                            !currentRole.HasFlag(Role.Travel))
                        {
                            if (attendee.Status != AttendeeStatus.Unknown || !currentRole.HasFlag(Role.Business))
                            {
                                return ValidationResponse<List<EventAttendee>>.CreateFailure($"User '{CurrentUsername}' does not have permission to modify attendee '{attendee.Username}' of event {eventID}.");
                            }
                        }
                    }
                }

                if (attendee.Status == AttendeeStatus.Unknown)
                {
                    // Skip if new but has already been added
                    if (DataRepo.GetAttendee(eventID, attendee.Username) != null)
                    {
                        Logging.LogMessage(LogLevel.DebugDetailed, $"{attendee.Username} is already a part of event {eventID}, skipping.");
                        continue;
                    }

                    newAttendeeCount++;
                }

                // Update attendee profiles if new
                if (attendee.Status == AttendeeStatus.Unknown)
                {
                    var profile = UserSrv.GetProfile(attendee.Username);

                    if (profile == null)
                    {
                        return ValidationResponse<List<EventAttendee>>.CreateFailure($"Attendee '{attendee.Username}' was not found.");
                    }

                    attendee.Profile.EmplID = profile.EmplID;

                    if (string.IsNullOrWhiteSpace(attendee.Profile.Title))
                    {
                        attendee.Profile.Title = profile.Title;
                    }

                    if (string.IsNullOrWhiteSpace(attendee.Profile.Mobile))
                    {
                        attendee.Profile.Mobile = profile.Mobile;
                    }

                    if (string.IsNullOrWhiteSpace(attendee.Profile.Telephone))
                    {
                        attendee.Profile.Telephone = profile.Telephone;
                    }

                    if (string.IsNullOrWhiteSpace(attendee.Profile.BadgeName))
                    {
                        attendee.Profile.BadgeName = profile.BadgeName;
                    }
                }

                // Check if a new delegate was assigned
                bool hasUserDelegateChanged = false;

                if (!string.IsNullOrWhiteSpace(attendee.Profile.DelegateUsername))
                {
                    var del = GetOrCreateProfile(attendee.Profile.DelegateUsername);

                    if (del == null)
                    {
                        return ValidationResponse<List<EventAttendee>>.CreateFailure(
                            $"The delegate '{attendee.Profile.DelegateUsername}' was not found."
                            );
                    }
                    else if (attendee.Profile.Username.Equals(del.DelegateUsername))
                    {
                        return ValidationResponse<List<EventAttendee>>.CreateFailure(
                            $"the delegate '{attendee.Profile.DelegateUsername}' is already one for '{attendee.Profile.Username}'."
                            );
                    }

                    var response = GetDelegate(attendee.Username);

                    if (!response.Success || response.Result == null)
                    {
                        hasUserDelegateChanged = true;
                    }
                    else if (!response.Result.Username.Equals(del.Username, StringComparison.CurrentCultureIgnoreCase))
                    {
                        hasUserDelegateChanged = true;
                    }
                }

                // Do not update Passport info unless required
                if (evt.ShowType != ShowType.International)
                {
                    attendee.Profile.HidePassportInfo();
                }

                AttendeeStatus curStatus = attendee.Status;
                AttendeeStatus newStatus = attendee.GetStatus();

                // Indicate if completed.
                if (attendee.IsCompleted(evt.Fields, evt.IsPassportRequired()))
                {
                    attendee.DateCompleted = attendee.DateCompleted.GetValueOrDefault(DateTime.Now);
                }
                else
                {
                    attendee.DateCompleted = null;
                }

                FieldComparisonResponse fieldComparisonResponse = null;
                try
                {
                    EventAttendee oldEventAttendee = DataRepo.GetAttendee(attendee.ID);

                    if (oldEventAttendee != null)
                    {
                        fieldComparisonResponse = attendee.Compare(oldEventAttendee);
                    }

                    attendee = DataRepo.SaveAttendee(attendee);
                    eventAttendees[i] = attendee;
                }
                catch (Exception ex)
                {
                    Logging.LogMessage(LogLevel.Error, $"Error saving attendee '{attendee.Username}' for event ID: {eventID}.  Ex: {ex}");
                    return ValidationResponse<List<EventAttendee>>.CreateFailure($"Error saving attendee '{attendee.Username}' for event ID: {eventID}");
                }

                if (hasUserDelegateChanged)
                {
                    // TODO: Send delegate notification
                    EmailSrv.SendDelegateNotification(attendee.Profile); // maybe make this of type EventAttendee?
                    Logging.LogMessage(LogLevel.DebugBasic, $"Send delegate email to '{attendee.Profile.DelegateUsername}'.");
                }

                // Don't bother sending notifications for past events
                if (evt.StartDate > DateTime.Now)
                {
                    // Handle notifications
                    if (newStatus != curStatus)
                    {
                        switch (newStatus)
                        {
                            case AttendeeStatus.Pending:
                                {
                                    if (attendee.SendRSVP && !attendee.DateRSVP.HasValue)
                                    {
                                        // TODO: Send RSVP Request and update DateRSVP
                                        attendee.DateRSVP = DateTime.Now;
                                        attendee = DataRepo.SaveAttendee(attendee);
                                        EmailSrv.SendRSVP(evt, attendee);

                                        if(DataRepo.IsUserNew(attendee.Username))
                                        {
                                            EmailSrv.SendNewUser(evt, attendee);
                                            Logging.LogMessage(LogLevel.DebugBasic, $"Send Welcome notification to {attendee.Username}.");
                                        }

                                        Logging.LogMessage(LogLevel.DebugBasic, $"Send RSVP to {attendee.Username} for event {eventID}.");
                                    }
                                    break;
                                }
                            case AttendeeStatus.Accepted:
                                // TODO: Send attending notifcation
                                EmailSrv.SendAttendingConfirmationNotification(evt, attendee);
                                Logging.LogMessage(LogLevel.DebugBasic, $"Send attending confirmation for {attendee.Username} and event {eventID}.");
                                break;
                            case AttendeeStatus.Declined:
                                // TODO: Send declined notifcation to the attendee who declined it and his/her delegate
                                EmailSrv.SendDeclinedConfirmationNotification(evt, attendee);
                                // Send user cancelled reservation email to Lead / Support / BCD
                                EmailSrv.SendUserCancelledReservationNotification(evt, attendee);
                                Logging.LogMessage(LogLevel.DebugBasic, $"Send declined confirmation for {attendee.Username} and event {eventID}.");
                                break;
                        }
                    }
                    else if (curStatus == AttendeeStatus.Accepted)
                    {
                        if ((fieldComparisonResponse?.IsChanged ?? false) && evt != null)
                        {
                            evt.LastBcdUpdated = null;
                            evt.LastBcdUpdatedDateTime = null;
                            DataRepo.SaveEvent(evt);
                            // TODO: Send notification to Lead / Support / BCD that user has updated their data.
                            EmailSrv.SendUserDetailsUpdatedNotification(evt, attendee, fieldComparisonResponse);
                        }

                        Logging.LogMessage(LogLevel.DebugBasic, $"Send notification to event team that '{attendee.Username}' has updated their info.");
                    }
                }
            }

            if (newAttendeeCount > 0)
            {
                // TODO: Send email notification to event Lead that new attendees have been added.
                EmailSrv.SendAttendeeAddedNotifications(evt, CurrentUsername);
                Logging.LogMessage(LogLevel.DebugBasic, $"Send new attendee added email to event Lead ({evt.OwnerUsername})");
            }

            return ValidationResponse<List<EventAttendee>>.CreateSuccess(eventAttendees);
        }



        public ValidationResponse<Workbook> ExportEventAttendees(int eventID, QueryParams parameters = null)
        {
            try
            {
                // Get event
                var evt = DataRepo.GetEvent(eventID);

                if (evt == null)
                {
                    return ValidationResponse<Workbook>.CreateFailure($"Event {eventID} was not found.");
                }

                // Validate user access to event.
                if (GetCurrentUserRole() != Role.Admin)
                {
                    if (!evt.OwnerUsername.Equals(CurrentUsername, StringComparison.CurrentCultureIgnoreCase))
                    {
                        if (!evt.Users.Any(u => u.User.Username.Equals(CurrentUsername, StringComparison.CurrentCultureIgnoreCase)))
                        {
                            return ValidationResponse<Workbook>.CreateFailure($"User '{CurrentUsername}' does not have permission to export the attendees of event {eventID}.");
                        }
                    }
                }

                if (parameters == null)
                {
                    parameters = new QueryParams();
                }

                // Take all
                parameters.Skip = 0;
                parameters.Size = 0;

                if (parameters.Filters == null)
                {
                    parameters.Filters = new List<FilterParams>();
                }

                // filter for event
                parameters.Filters.Add(new FilterParams
                {
                    Field = "TradeshowID",
                    Operator = "eq",
                    Value = eventID.ToString()
                });

                List<EventAttendee> attendees = new List<EventAttendee>();

                try
                {
                    // Get attendees
                    attendees = DataRepo.GetEventAttendeesList(parameters);
                }
                catch (Exception ex)
                {
                    Logging.LogMessage(LogLevel.Error, $"Error querying event attendees. Ex: {ex}");
                    return ValidationResponse<Workbook>.CreateFailure("Error querying event attendees.");
                }

                Workbook wb = new Workbook();
                wb.Name = evt.Name;

                Worksheet ws = wb.Worksheets.Add();
                ws.Name = "Attendees";

                // Create column names
                int rowIndex = 0, colIndex = 0;

                ws.Cells[rowIndex, colIndex].SetValue("Picture");
                ws.Cells[rowIndex, ++colIndex].SetValue("First Name");
                ws.Cells[rowIndex, ++colIndex].SetValue("Last Name");
                ws.Cells[rowIndex, ++colIndex].SetValue("RSVP Request Sent");
                ws.Cells[rowIndex, ++colIndex].SetValue("RSVP Response (Y/N)");
                ws.Cells[rowIndex, ++colIndex].SetValue("Job Title");
                ws.Cells[rowIndex, ++colIndex].SetValue("Segment");
                ws.Cells[rowIndex, ++colIndex].SetValue("Delegate");
                ws.Cells[rowIndex, ++colIndex].SetValue("Email");
                ws.Cells[rowIndex, ++colIndex].SetValue("Work Number");
                ws.Cells[rowIndex, ++colIndex].SetValue("Cell Number");
                ws.Cells[rowIndex, ++colIndex].SetValue("Name on Badge");
                ws.Cells[rowIndex, ++colIndex].SetValue("Passport");
                ws.Cells[rowIndex, ++colIndex].SetValue("VISA");
                ws.Cells[rowIndex, ++colIndex].SetValue("Other");

                if (evt.Fields != null)
                {
                    foreach (var field in evt.Fields)
                    {
                        // skip these fields on the export
                        if (field.Label == "Harris Credit Card Number" || field.Label == "Expiration Date" || field.Label == "CVV Number")
                        {
                            continue;
                        }

                        ws.Cells[rowIndex, ++colIndex].SetValue(field.Label);
                    }
                }

                ws.Rows[0].SetIsBold(true);

                int columns = colIndex;

                foreach (var attendee in attendees)
                {
                    rowIndex++;
                    colIndex = 1;

                    // download and add attendee image
                    var picRec = DataRepo.GetAvatar(attendee.Username.ToUpper());
                    if (picRec != null && picRec.Image != null && picRec.Image.Length > 0)
                    {
                        try
                        {
                            var ms = new MemoryStream(picRec.Image);
                            var imageSource = new ImageSource(ms, picRec.ImageType.Substring(picRec.ImageType.LastIndexOf('/') + 1));
                            var floatingImage = new FloatingImage(ws, new CellIndex(rowIndex, colIndex - 1), 0, 0);
                            floatingImage.ImageSource = imageSource;
                            floatingImage.LockAspectRatio = true;
                            floatingImage.SetHeight(true, 96, false);
                            floatingImage.SetWidth(true, 96, false);  // some test pics were wide
                            ws.Shapes.Add(floatingImage);
                        }
                        catch (Exception e)
                        {
                            Logging.LogMessage(LogLevel.DebugBasic, e.Message);
                        }
                    }
                    else
                    {
                        string url = $"https://my.harris.com/peopleFinder/employeePics/{attendee.Profile.EmplID}.jpg";
                        Logging.LogMessage(LogLevel.DebugBasic, $"Fetching picture for {attendee.Username}. ({url})");

                        using (var client = new WebClient())
                        {
                            try
                            {
                                client.Credentials = CredentialCache.DefaultNetworkCredentials;
                                client.UseDefaultCredentials = true;
                                var content = client.DownloadData(url);
                                var stream = new MemoryStream(content);
                                var imageSource = new ImageSource(stream, "jpg");
                                var floatingImage = new FloatingImage(ws, new CellIndex(rowIndex, colIndex - 1), 0, 0);
                                floatingImage.ImageSource = imageSource;
                                floatingImage.LockAspectRatio = true;
                                floatingImage.SetHeight(true, 96, false);
                                floatingImage.SetWidth(true, 96, false);  // some test pics were wide
                                ws.Shapes.Add(floatingImage);
                            }
                            catch (Exception e)
                            {
                                Logging.LogMessage(LogLevel.DebugBasic, e.Message);
                            }
                        }
                    }


                    ws.Cells[rowIndex, colIndex].SetValue(attendee.Profile.FirstName);
                    ws.Cells[rowIndex, ++colIndex].SetValue(attendee.Profile.LastName);

                    if (attendee.DateRSVP.HasValue)
                    {
                        ws.Cells[rowIndex, ++colIndex].SetValue(attendee.DateRSVP.Value);
                    }
                    else
                    {
                        ++colIndex;
                    }

                    ws.Cells[rowIndex, ++colIndex].SetValue(attendee.GetRsvpResponse());
                    ws.Cells[rowIndex, ++colIndex].SetValue(attendee.Profile.Title);
                    ws.Cells[rowIndex, ++colIndex].SetValue(attendee.Profile.Segment);

                    if (attendee.Profile.Delegate != null)
                    {
                        ws.Cells[rowIndex, ++colIndex].SetValue(attendee.Profile.Delegate.FirstName + " " + attendee.Profile.Delegate.LastName);
                    }
                    else
                    {
                        ++colIndex;
                    }

                    ws.Cells[rowIndex, ++colIndex].SetValue(attendee.Profile.Email);
                    ws.Cells[rowIndex, ++colIndex].SetValue((attendee.Profile.Telephone != null) ? attendee.Profile.Telephone.Replace("+", "") : "");
                    ws.Cells[rowIndex, ++colIndex].SetValue((attendee.Profile.Mobile != null) ? attendee.Profile.Mobile.Replace("+", "") : "");
                    ws.Cells[rowIndex, ++colIndex].SetValue(attendee.Profile.BadgeName);

                    //set the travel document booleans
                    ws.Cells[rowIndex, ++colIndex].SetValue(DataRepo.IsPassportOnProfile(attendee.Username) ? "Y" : "N");
                    ws.Cells[rowIndex, ++colIndex].SetValue(DataRepo.IsVisaOnProfile(attendee.Username) ? "Y" : "N");
                    ws.Cells[rowIndex, ++colIndex].SetValue(DataRepo.IsOtherOnProfile(attendee.Username) ? "Y" : "N");


                    if (evt.Fields != null)
                    {
                        foreach (var field in evt.Fields)
                        {
                            // skip these fields on the export
                            if (field.Label == "Harris Credit Card Number" || field.Label == "Expiration Date" || field.Label == "CVV Number")
                            {
                                continue;
                            }

                            if (string.IsNullOrWhiteSpace(field.Source))
                            {
                                if (!attendee.Properties.ContainsKey(field.ID))
                                {
                                    colIndex++;
                                    continue;
                                }

                                string value = attendee.Properties[field.ID];

                                if (field.Input == InputType.Date)
                                {
                                    colIndex++;

                                    DateTime? dateValue = value.ToDateTime();

                                    if (dateValue.HasValue)
                                    {
                                        ws.Cells[rowIndex, colIndex].SetValue(dateValue.Value);
                                    }
                                }
                                else if (field.Input == InputType.MultiSelect)
                                {
                                    value = value.Replace("|", ", ");
                                    ws.Cells[rowIndex, ++colIndex].SetValue(value);
                                }
                                else
                                {
                                    ws.Cells[rowIndex, ++colIndex].SetValue(value);
                                }
                            }
                            else
                            {
                                var property = attendee.GetType().GetProperty(field.Source);

                                if (property == null)
                                {
                                    colIndex++;
                                    continue;
                                }

                                if (property.PropertyType == typeof(DateTime?))
                                {
                                    colIndex++;

                                    DateTime? dateValue = property.GetValue(attendee) as DateTime?;

                                    if (dateValue.HasValue)
                                    {
                                        ws.Cells[rowIndex, colIndex].SetValue(dateValue.Value);
                                    }
                                }
                                else if (field.Input == InputType.MultiSelect)
                                {
                                    string value = property.GetValue(attendee) as string;
                                    if (!string.IsNullOrWhiteSpace(value))
                                    {
                                        value = value.Replace("|", ", ");
                                    }
                                    ws.Cells[rowIndex, ++colIndex].SetValue(value);
                                }
                                else
                                {
                                    string value = property.GetValue(attendee) as string;
                                    ws.Cells[rowIndex, ++colIndex].SetValue(value);
                                }
                            }
                        }
                    }
                }

                ws.Columns[0, columns].AutoFitWidth();
                ws.Columns[0, 0].SetWidth(new ColumnWidth(96, false));
                ws.Rows[1, rowIndex].SetHeight(new RowHeight(96, true));

                ws.ViewState.FreezePanes(1, 0);

                return ValidationResponse<Workbook>.CreateSuccess(wb);

            }
            catch (Exception e) { Logging.LogMessage(LogLevel.DebugBasic, e.Message); }

            return null;
        }

        public ValidationResponse<bool> DeleteAttendees(int eventID, int[] attendeeIDs)
        {
            if (attendeeIDs == null || attendeeIDs.Length == 0)
            {
                return ValidationResponse<bool>.CreateSuccess(true);
            }

            var evt = DataRepo.GetEvent(eventID);

            if (evt == null)
            {
                return ValidationResponse<bool>.CreateFailure($"Event {eventID} was not found.");
            }

            // Check permissions
            if (CurrentUser.Privileges != Permissions.Admin)
            {
                Role role = evt.GetUserRole(CurrentUsername);

                if (!role.HasFlag(Role.Lead) &&
                    !role.HasFlag(Role.Support) &&
                    !role.HasFlag(Role.Business))
                {
                    return ValidationResponse<bool>.CreateFailure($"User '{CurrentUsername}' does not have permission to delete attendees of event {eventID}.");
                }
            }

            // If the event has not already passed, send notifications to the attendees that have RSVP'd as YES
            List<EventAttendee> attendees = null;

            if (evt.StartDate > DateTime.Now)
            {
                attendees = GetAcceptedAttendees(eventID);

                if (attendees != null)
                {
                    attendees = attendees.Where(a => attendeeIDs.Contains(a.ID)).ToList();
                }
            }

            try
            {
                DataRepo.DeleteAttendees(attendeeIDs);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error deleting attendees: {String.Join(", ", attendeeIDs)}.  Ex: {ex}");
                return ValidationResponse<bool>.CreateFailure($"Error deleting attendees: {String.Join(", ", attendeeIDs)}.");
            }

            if (attendees != null)
            {
                foreach (var attendee in attendees)
                {
                    // TODO: Send notification that their attendance has been cancelled.
                    EmailSrv.SendAttendeeRemovalNotification(evt, attendee);
                    Logging.LogMessage(LogLevel.DebugBasic, $"Send cancellation email to {attendee.Username}.");
                }
            }

            return ValidationResponse<bool>.CreateSuccess(true);
        }

        public ValidationResponse<AttendeeQueryResult> GetAttendees(QueryParams parameters = null)
        {
            if (parameters == null)
            {
                parameters = new QueryParams();
            }

            parameters.Skip = Math.Max(parameters.Skip, 0);
            parameters.Size = Math.Max(parameters.Size, 25);

            string identityUser = null;

            if (GetCurrentUserRole() != Role.Admin)
            {
                identityUser = CurrentUsername;
            }

            AttendeeQueryResult result = null;

            try
            {
                result = DataRepo.GetAttendeeProfiles(parameters, identityUser);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error querying attendees. Ex: {ex}");
                return ValidationResponse<AttendeeQueryResult>.CreateFailure("Error querying attendees.");
            }

            return ValidationResponse<AttendeeQueryResult>.CreateSuccess(result);
        }

        public ValidationResponse<List<AttendeeEvent>> GetAttendeeEvents(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return ValidationResponse<List<AttendeeEvent>>.CreateFailure("The username is required.");
            }

            username = username.Trim().ToUpper();

            string identityUser = null;

            if (GetCurrentUserRole() != Role.Admin)
            {
                identityUser = CurrentUsername;
            }

            try
            {
                return ValidationResponse<List<AttendeeEvent>>.CreateSuccess(
                    DataRepo.GetAttendeeEvents(username, identityUser)
                    );
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Error, $"Error getting attendee events for {username}.  Ex: {ex}");
                return ValidationResponse<List<AttendeeEvent>>.CreateFailure($"Error getting attendee events for {username}.");
            }
        }

        #endregion

        #region Helpers

        private void onEventFieldsChanged(EventInfo evt, bool hasNewRequiredFields = false)
        {
            List<EventAttendee> attendees = GetAllAttendees(evt.ID);

            for (int i = 0; i < attendees.Count; ++i)
            {
                var attendee = attendees[i];

                // Update date completed
                if (attendee.IsCompleted(evt.Fields, evt.IsPassportRequired()))
                {
                    if (!attendee.DateCompleted.HasValue)
                    {
                        attendee.DateCompleted = DateTime.Now;
                        attendee = DataRepo.SaveAttendee(attendee);
                    }
                }
                else
                {
                    if (attendee.DateCompleted.HasValue)
                    {
                        attendee.DateCompleted = null;
                        attendee = DataRepo.SaveAttendee(attendee);
                    }

                    if (hasNewRequiredFields && attendee.Status == AttendeeStatus.Accepted)
                    {
                        // TODO: send notification to any accepted attendee that new field(s) are required.
                        EmailSrv.SendNewFieldsAddedNotification(attendee);
                        Logging.LogMessage(LogLevel.DebugBasic, $"Email '{attendee.Username} that new fields are required.");
                    }
                }
            }
        }

        private List<EventAttendee> GetAllAttendees(int eventID)
        {
            QueryParams parameters = new QueryParams();
            parameters.Filters = new List<FilterParams>();

            // filter for this event
            parameters.Filters.Add(new FilterParams
            {
                Field = "TradeshowID",
                Operator = "eq",
                Value = eventID.ToString()
            });

            return DataRepo.GetEventAttendeesList(parameters);
        }

        private List<EventAttendee> GetAcceptedAttendees(int eventID)
        {
            QueryParams parameters = new QueryParams();
            parameters.Filters = new List<FilterParams>();

            // filter for this event
            parameters.Filters.Add(new FilterParams
            {
                Field = "TradeshowID",
                Operator = "eq",
                Value = eventID.ToString()
            });

            // filter for Accepted status
            parameters.Filters.Add(new FilterParams
            {
                Field = "Status",
                Operator = "eq",
                Value = AttendeeStatus.Accepted.ToString()
            });

            return DataRepo.GetEventAttendeesList(parameters);
        }

        #endregion
    }
}
