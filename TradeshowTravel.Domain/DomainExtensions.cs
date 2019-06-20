using System;
using System.Collections.Generic;
using System.Linq;

namespace TradeshowTravel.Domain
{
    using DTOs;
    using Common.Logging;
    using System.Text.RegularExpressions;

    public class Encrypted : Attribute
    { }

    public static class DomainExtensions
    {
        public static string ToDTOFormat(this DateTime? datetime)
        {
            if (datetime.HasValue)
            {
                return datetime.Value.ToString("yyyy-MM-ddTHH:mm:ssZ");
            }

            return null;
        }

        public static string ToShortDateFormat(this DateTime? datetime)
        {
            if (datetime.HasValue)
            {
                return datetime.Value.ToShortDateString();
            }

            return null;
        }

        public static bool DatePartEquals(this DateTime? sourceDateTime, DateTime? targetDateTime)
        {
            //Both of them don't have value so they're equal
            if(!sourceDateTime.HasValue && !targetDateTime.HasValue)
            {
                return true;
            }

            DateTime sourceDate = sourceDateTime.HasValue ? sourceDateTime.Value.Date : DateTime.MinValue.Date;
            DateTime targetDate = targetDateTime.HasValue ? targetDateTime.Value.Date : DateTime.MinValue.Date;

            return sourceDate == targetDate;
        }

        public static string ToYesNoString(this bool? str)
        {
            if (str == null)
            {
                return null;
            }

            return str.Value ? "Yes" : "No";
        }

        public static bool? ToBoolean(this string str)
        {
            if (!string.IsNullOrWhiteSpace(str))
            {
                switch (str.Trim().ToUpper())
                {
                    case "1":
                    case "TRUE":
                    case "YES":
                        return true;
                    default:
                        return false;
                }
            }

            return null;
        }

        public static DateTime? ToDateTime(this string str)
        {
            if (!string.IsNullOrWhiteSpace(str))
            {
                DateTime dt = DateTime.MinValue;

                if (DateTime.TryParse(str, out dt))
                {
                    return dt;
                }
            }

            return null;
        }

        public static void HidePassportInfo(this UserProfile profile)
        {
            if (profile != null)
            {
                profile.PassportName = null;
                profile.PassportNumber = null;
                profile.PassportExpirationDate = null;
                profile.Nationality = null;
                profile.DOB = null;
                profile.COB = null;
                profile.COI = null;
                profile.COR = null;
            }
        }

        public static string ToShowTypeString(ShowType showtype)
        {
            switch (showtype)
            {
                case ShowType.Unknown:
                    return string.Empty;
                default:
                    return showtype.ToString();
            }
        }

        public static string GetRsvpResponse(this EventAttendee attendee)
        {
            if (attendee == null)
            {
                return string.Empty;
            }

            switch (attendee.Status)
            {
                case AttendeeStatus.Accepted:
                    return "Yes";
                case AttendeeStatus.Declined:
                    return "No";
                default:
                    return "No Response";
            }
        }

        public static bool IsPassportRequired(this EventInfo evt)
        {
            if (evt == null)
            {
                return false;
            }

            return evt.ShowType == ShowType.International;
        }

        public static ShowType ToShowType(this string str)
        {
            if (!string.IsNullOrWhiteSpace(str))
            {
                switch (str.Trim().ToUpper())
                {
                    case "DOMESTIC":
                        return ShowType.Domestic;
                    case "INTERNATIONAL":
                        return ShowType.International;
                }
            }

            return ShowType.Unknown;
        }

        public static InputType ToInputType(this string str)
        {
            if (!string.IsNullOrWhiteSpace(str))
            {
                switch (str.Trim().ToUpper())
                {
                    case "SHORTTEXT":
                        return InputType.ShortText;
                    case "LONGTEXT":
                        return InputType.LongText;
                    case "DATE":
                        return InputType.Date;
                    case "YESORNO":
                        return InputType.YesOrNo;
                    case "MULTISELECT":
                        return InputType.MultiSelect;
                    case "SELECT":
                        return InputType.Select;
                }
            }

            return InputType.Unknown;
        }

        public static Role GetUserRole(this EventInfo evt, string username)
        {
            if (evt == null || string.IsNullOrWhiteSpace(username))
            {
                return Role.None;
            }

            Role role = Role.None;

            if (username.Equals(evt.OwnerUsername, StringComparison.CurrentCultureIgnoreCase))
            {
                role |= Role.Lead;
            }

            if (evt.Users != null)
            {
                foreach (var u in evt.Users)
                {
                    if (username.Equals(u.User.Username, StringComparison.CurrentCultureIgnoreCase))
                    {
                        role |= u.Role;
                    }
                }
            }

            return role;
        }

        public static AttendeeStatus ToAttendeeStatus(this string status)
        {
            if (!string.IsNullOrWhiteSpace(status))
            {
                switch (status.Trim().ToUpper())
                {
                    case "PENDING":
                        return AttendeeStatus.Pending;
                    case "INVITED":
                        return AttendeeStatus.Invited;
                    case "ACCEPTED":
                        return AttendeeStatus.Accepted;
                    case "DECLINED":
                        return AttendeeStatus.Declined;
                }
            }

            return AttendeeStatus.Unknown;
        }

        public static AttendeeStatus GetStatus(this EventAttendee attendee)
        {
            if (attendee == null)
            {
                return AttendeeStatus.Unknown;
            }

            if (attendee.IsAttending.ToBoolean().HasValue)
            {
                if (attendee.IsAttending.ToBoolean().Value)
                {
                    return AttendeeStatus.Accepted;
                }
                else
                {
                    return AttendeeStatus.Declined;
                }
            }
            else if (attendee.DateRSVP.HasValue)
            {
                return AttendeeStatus.Invited;
            }

            return AttendeeStatus.Pending;
        }

        public static bool IsCompleted(this object obj, string propertyName)
        {
            if (obj == null || string.IsNullOrWhiteSpace(propertyName))
            {
                return false;
            }

            var property = obj.GetType().GetProperty(propertyName);

            if (property == null)
            {
                return false;
            }

            if (property.PropertyType == typeof(string))
            {
                if (string.IsNullOrWhiteSpace((string)property.GetValue(obj)))
                {
                    return false;
                }
            }
            else
            {
                if (property.GetValue(obj) == null)
                {
                    return false;
                }
            }
            
            return true;
        }

        public static bool IsCompleted(this EventAttendee attendee, List<EventField> fields, bool isPassportRequired)
        {
            if (attendee == null)
            {
                return false;
            }

            if (attendee.Profile == null)
            {
                return false;
            }
            
            foreach (var propName in UserProfile.EVENT_PROFILE_REQ_FIELDS)
            {
                if (!attendee.Profile.IsCompleted(propName))
                {
                    return false;
                }
            }
            
            if (isPassportRequired)
            {
                foreach (var propName in UserProfile.PASSPORT_REQ_FIELDS)
                {
                    if (!attendee.Profile.IsCompleted(propName))
                    {
                        return false;
                    }
                }
            }

            if (fields != null)
            {
                foreach (var field in fields.Where(f => f.Included && f.Required && f.Access.HasFlag(Role.Attendee)))
                {
                    if (string.IsNullOrWhiteSpace(field.Source))
                    {
                        if (!attendee.Properties.ContainsKey(field.ID))
                        {
                            return false;
                        }

                        if (string.IsNullOrWhiteSpace(attendee.Properties[field.ID]))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        var property = typeof(EventAttendee).GetProperty(field.Source);

                        if (property == null)
                        {
                            return false;
                        }

                        if (property.GetValue(attendee) == null)
                        {
                            return false;
                        }
                    }
                }
            }
            
            return true;
        }

        public static bool IsBusinessLeadForSegment(this EventUser eventUser, string eventSegments)
        {
            //Business lead role is on a segment basis. In this method, we check if a given user belongs to the segment(s) of the current event
            if (string.IsNullOrWhiteSpace(eventSegments))
            {
                return false;
            }

            string[] segments = eventSegments.Split(',');
            return eventUser.Role.HasFlag(Role.Business) && segments.Contains(eventUser.User.Segment);
        }

        public static string GetLabel(this List<EventField> eventFields, string source)
        {
            return eventFields.FirstOrDefault(f => f.Source == source)?.Label ?? source;
        }

        public static string GetUserName(this string userIdentity)
        {
            return string.IsNullOrWhiteSpace(userIdentity) ? string.Empty : Regex.Replace(userIdentity, ".*\\\\|@.*", string.Empty);
        }
    }
}
