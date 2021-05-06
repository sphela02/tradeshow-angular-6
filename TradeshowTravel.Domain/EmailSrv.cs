using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mail;

namespace TradeshowTravel.Domain
{
    using Common.Logging;
    using DTOs;
    using System;
    using System.Configuration;
    using System.IO;
    using System.Text;
    using System.Web;

    public class EmailSrv : IReminderSrv
    {
        private readonly string smtpServer;
        private readonly string sender;
        private readonly string baseUrl;

        private readonly string EMAIL_TEMPLATE_PATH = ConfigurationManager.AppSettings["EmailTemplatesPath"];

        private IDataRepository repo = null;

        public readonly string TempFolderRoot;

        public EmailSrv(IDataRepository repo, string smtpServer, string sender, string baseUrl, string aTempFolderRoot)
        {
            this.repo = repo;
            this.smtpServer = smtpServer;
            this.sender = sender;
            this.baseUrl = baseUrl;

            TempFolderRoot = aTempFolderRoot;
        }

        // User creates new event.
        public void SendNewEventNotifications(EventInfo evt)
        {
            var subject = $"Event Travel Portal | New Event Created";
            var body = $"Hello All,\n\nYou have been assigned a role for a new event: {evt.Name}\n\nView Event: {getEventUrl(evt.ID)}\n\n{getSignature(evt)}";

            // send to owner/lead
            this.Send(evt.Owner.Email, subject, body);

            // send to travel, support, leads, business leads (only receive emails for their segments)
            if (evt.Users != null)
            {
                foreach (var eventUser in evt.Users.Where(x => x.Role.HasFlag(Role.Travel) || x.Role.HasFlag(Role.Support) || x.Role.HasFlag(Role.Lead)
                  || x.IsBusinessLeadForSegment(evt.Segments)))
                {
                    this.Send(eventUser.User.Email, subject, body);
                }
            }
        }
    
        // send RSVP using custom text from user.
        public void SendRSVP(EventInfo evt, EventAttendee attendee, RsvpRequest req)
        {
            string folder = Path.Combine(TempFolderRoot, evt.ID.ToString());

            var subject = $"[Action Requested] Event Travel Portal | RSVP: You have been invited to attend {evt.Name}";

            var body = req.EmailText.Replace("<EventAttendee.Name>", attendee.Profile.FirstName)
                .Replace("<Event.RsvpDueDate>", req.DueDate.ToShortDateString())
                .Replace("<Page: EventInfo.Name>", getRSVPUrl(attendee.ID))
                .Replace("<EventInfo.Name>", evt.Name);

            List<Attachment> attachments = new List<Attachment>();
            if (req.Attachments != null)
            {
                foreach (string attachment in req.Attachments)
                {
                    attachments.Add(new Attachment(attachment));
                }
            }

            if (attendee.Profile.Delegate != null)
            {
                var cc = new List<string>();
                cc.Add(attendee.Profile.Email);
                cc.Add(evt.Owner.Email);

                this.Send(attendee.Profile.Delegate.Email, subject, body, cc, attachments.ToArray());
            }
            else
            {
                this.Send(attendee.Profile.Email, subject, body, evt.Owner.Email, attachments.ToArray());
            }

            RemoveTempFiles(folder, attachments);
        }

        private static void RemoveTempFiles(string folder, List<Attachment> attachments)
        {
            if (attachments == null || attachments.Count == 0)
            {
                return;
            }

            foreach (object o in attachments)
            {
                System.IDisposable disposableObject = o as System.IDisposable;
                if (disposableObject != null)
                {
                    disposableObject.Dispose();
                }
            }
            
            foreach (var item in Directory.GetFiles(folder))
            {
                try
                {
                    File.Delete(item);
                }
                catch (Exception ex)
                {
                    Logging.LogMessage(LogLevel.DebugDetailed, $"Unable to delete file {item}. Exception: {ex} Message {ex.Message}");
                }
            }

            try
            {
                Directory.Delete(folder);
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.DebugDetailed, $"Unable to delete folder {folder}. Exception: {ex} Message {ex.Message}");

            }
        }

        // send RSVP using standard text.
        public void SendRSVP(EventInfo evt, EventAttendee attendee)
        {
            var subject = $"[Action Requested] Event Travel Portal | RSVP: You have been invited to attend {evt.Name}";
            var body = $"Hello {attendee.Profile.FirstName}," +
                    $"\n\nYou have been nominated to attend {evt.Name}! " +
                    $"You must RSVP by {evt.RsvpDueDate.GetValueOrDefault().ToShortDateString()} to attend. " +
                    $"\n\nA block of rooms have been reserved, so please do not make your own reservations. " +
                    $"You will need to book your airfare through Concur. If you are driving and do not require lodging, " +
                    $"you still need to fill out all required fields. Delegates will be assigned automatically for VP and " +
                    $"above but anyone can assign a delegate. Both you and your delegate will receive all e-mails from the travel portal. " +
                    $"Make sure date and changes or cancellations are made in the portal to keep all information up to date in real time. " +
                    $"\n\nThis portal serves not only as the approved attendee list but also provides historical information for the Tradeshow planning team." +
                    $"\n\nRSVP Here: {getRSVPUrl(attendee.ID)}\n\n{getSignature(evt)}";

            if (attendee.Profile.Delegate != null)
            {
                var cc = new List<string>();
                cc.Add(attendee.Profile.Email);
                cc.Add(evt.Owner.Email);

                this.Send(attendee.Profile.Delegate.Email, subject, body, cc);
            }
            else
            {
                this.Send(attendee.Profile.Email, subject, body, evt.Owner.Email);
            }

            // this.Send(attendee.Profile.Email, subject, body, evt.Owner.Email);
        }

        // send new user email using standard text.
        public void SendNewUser(EventInfo evt, EventAttendee attendee)
        {
            var subject = $"Event Travel Portal welcome e-mail";
            var body = $"{attendee.Profile.FirstName},\n\nWelcome to the Event Travel Portal.  This portal is used for all tradeshow attendees to plan your travel details(like hotel).  Your profile is auto populated from PeopleFluent.  Once your profile is complete, it will be saved for future shows.  Any PII entered is only viewable by event portal admins and secured according to L3Harris policy.\n\nOnce you have been entered for a show, you will receive an e-mail with a link and instructions to enter the required fields.  Be mindful that the dates you enter into the system are the dates you will be confirmed through our hotel block.\n\nDelegates will be assigned automatically for VP and above but anyone can assign a delegate in your profile.  Both you and your delegate will receive all e-mails from the travel portal.\n\n{getSignature(evt)}";
            var documentsRootPath = HttpContext.Current.Server.MapPath(@"~\App_Data");

            Attachment attachment1 = new Attachment(Path.Combine(documentsRootPath, "EventTravelPortal_QuickStartGuide_Attendee.pdf"));
            Attachment attachment2 = new Attachment(Path.Combine(documentsRootPath, "EventTravelPortal_UserManual_Attendee.pdf"));

            if (attendee.Profile.Delegate != null)
            {
                var cc = new List<string>();
                cc.Add(attendee.Profile.Email);
                cc.Add(evt.Owner.Email);

                this.Send(attendee.Profile.Delegate.Email, subject, body, cc, new Attachment[] { attachment1, attachment2 });
            }
            else
            {
                this.Send(attendee.Profile.Email, subject, body, evt.Owner.Email, new Attachment[] { attachment1, attachment2 });
            }
        }

        // Attendee has not responded to RSVP email within the past WEEK/24 hours.
        public void SendReminderRSVPs(EventInfo evt, List<EventAttendee> attendees)
        {
            foreach (var attendee in attendees)
            {
                // skip this attendee if they previously RSVP'd
                if (attendee.DateRSVP.HasValue) continue;

                var subject = $"Event Travel Portal | Reminder for {evt.Name}";
                var body = $"Hello {attendee.Profile.FirstName},\n\nYou have not RSVP’d for the {evt.Name} event. Please RSVP by {evt.RsvpDueDate.GetValueOrDefault().ToShortDateString()} to secure your spot.\n\nRSVP Here: {getRSVPUrl(attendee.ID)}\n\n{getSignature(evt)}";

                if (attendee.Profile.Delegate != null)
                {
                    this.Send(attendee.Profile.Delegate.Email, subject, body, attendee.Profile.Email);
                }
                else
                {
                    this.Send(attendee.Profile.Email, subject, body);
                }

                //this.Send(attendee.Profile.Email, subject, body);
            }
        }

        // Attendee has not responded to RSVP email within the past WEEK/24 hours.
        public void SendReminderNotifications(EventInfo evt, List<EventAttendee> attendees, ReminderRequest req)
        {
            foreach (var attendee in attendees)
            {
                var subject = $"Event Travel Portal | Reminder for {evt.Name}";
                // var body = $"Hello {attendee.Profile.FirstName},\n\nYou have not RSVP’d for the {evt.Name} event. Please RSVP by {evt.RsvpDueDate.GetValueOrDefault().ToShortDateString()} to secure your spot.\n\nRSVP Here: {getRSVPUrl(attendee.ID)}\n\n{signature}";

                var body = req.EmailText.Replace("<EventAttendee.Name>", attendee.Profile.FirstName)
                    .Replace("<Page: EventInfo.Name>", getRSVPUrl(attendee.ID))
                    .Replace("<EventInfo.Name>", evt.Name);

                List<Attachment> attachments = new List<Attachment>();
                if (req.Attachments != null)
                {
                    foreach (string attachment in req.Attachments)
                    {
                        attachments.Add(new Attachment(attachment));
                    }
                }

                if (attendee.Profile.Delegate != null)
                {
                    var cc = new List<string>();
                    cc.Add(attendee.Profile.Email);
                    cc.Add(evt.Owner.Email);

                    this.Send(attendee.Profile.Delegate.Email, subject, body, cc, attachments.ToArray());
                }
                else
                {
                    this.Send(attendee.Profile.Email, subject, body, evt.Owner.Email, attachments.ToArray());
                }

                //this.Send(attendee.Profile.Email, subject, body, evt.Owner.Email);
            }
        }

        // Attendee RSVPs and saves delegate name with detail information.
        public void SendDelegateNotification(UserProfile profile)
        {
            var subject = $"Event Travel Portal | You are a delegate for {profile.FirstName} {profile.LastName}!";
            var body = $"Hello {profile.Delegate.FirstName},\n\nYou have been assigned as a delegate for {profile.FirstName} {profile.LastName} within the Event Travel Portal and now have access to view and edit their event profile information.\n\nView Event: {getUserProfileUrl(profile.Delegate.Username)}";

            // send to delegate, CC attendee
            this.Send(profile.Delegate.Email, subject, body, profile.Email);
        }

        // Attendee accepts event invite/RSVPs.
        public void SendAttendingConfirmationNotification(EventInfo evt, EventAttendee attendee)
        {
            var subject = $"Event Travel Portal | {evt.Name}: Attendance Confirmation";
            var body = $"Hello {attendee.Profile.FirstName},\n\nThank you for RSVP'ing to {evt.Name} on {evt.StartDate.ToShortDateString()} at {evt.Venue}.\n\nYou can change your details for this event here: {getUserProfileUrl(attendee.Profile.Username)}.\n\n{getSignature(evt)}";

            if (attendee.Profile.Delegate != null)
            {
                this.Send(attendee.Profile.Delegate.Email, subject, body, attendee.Profile.Email);
            }
            else
            {
                this.Send(attendee.Profile.Email, subject, body);
            }

            // send to attendee
            //this.Send(attendee.Profile.Email, subject, body);
        }

        // Attendee declines event invite.
        public void SendDeclinedConfirmationNotification(EventInfo evt, EventAttendee attendee)
        {
            var subject = $"Event Travel Portal | {evt.Name}: Attendance Declined";
            var body = $"Hello {attendee.Profile.FirstName}\n\nYou are receiving this email to confirm that you decline attendance to {evt.Name}.\n\nIf this is an error or you have changed your mind, please resubmit your RSVP information by {evt.RsvpDueDate.GetValueOrDefault().ToShortDateString()}: {getRSVPUrl(attendee.ID)}\n\n{getSignature(evt)}";

            if (attendee.Profile.Delegate != null)
            {
                this.Send(attendee.Profile.Delegate.Email, subject, body, attendee.Profile.Email);
            }
            else
            {
                this.Send(attendee.Profile.Email, subject, body);
            }

            // send to attendee
            //this.Send(attendee.Profile.Email, subject, body);
        }

        // attendee cancels their reservation. It used to the same email as "Attendee information has been updated". Since TSTRAV-1, we splited it into two separate emails.
        public void SendUserCancelledReservationNotification(EventInfo evt, EventAttendee attendee)
        {
            const string EMAIL_NOTIFICATION_NAME = "UserCancelledReservationNotification";

            string subject = $"Event Travel Portal | {evt.Name}: Attendee has cancelled the reservation";
            string eventUrl = getEventUrl(attendee.EventID);
            string signature = getSignature(evt).Replace("\n", "</br>");

            string emailTemplate = File.ReadAllText(HttpContext.Current.Server.MapPath(string.Format(EMAIL_TEMPLATE_PATH, EMAIL_NOTIFICATION_NAME)));

            string body = emailTemplate.Replace("{FirstName}", attendee.Profile.FirstName)
                  .Replace("{LastName}", attendee.Profile.LastName)
                  .Replace("{EventUrl}", eventUrl)
                  .Replace("{Signature}", signature);

            body = body.Replace("{Receipient}", evt.Owner.FirstName);

            // send to lead
            this.Send(evt.Owner.Email, subject, body, isBodyHtml: true);

            // send to travel, support, leads, business leads (only receive emails for their segments)
            if (evt.Users != null)
            {
                foreach (var eventUser in evt.Users.Where(x => x.Role.HasFlag(Role.Travel) || x.Role.HasFlag(Role.Support) || x.Role.HasFlag(Role.Lead)
                  || x.IsBusinessLeadForSegment(evt.Segments)))
                {
                    body = body.Replace("{Receipient}", eventUser.User.FirstName);
                    this.Send(eventUser.User.Email, subject, body, isBodyHtml: true);
                }
            }
        }

        // attendee updated their info.
        public void SendUserDetailsUpdatedNotification(EventInfo evt, EventAttendee attendee, FieldComparisonResponse fieldComparisonResponse)
        {
            const string EMAIL_NOTIFICATION_NAME = "UserDetailsUpdatedNotification";
            const string TABLE_ROW_TEMPLATE_FILE_NAME = "TableRowTemplate";

            string subject = $"Event Travel Portal | {evt.Name}: Attendee information has been updated";
            string eventUrl = getEventUrl(attendee.EventID);
            string signature = getSignature(evt).Replace("\n", "</br>");

            string emailTemplate = File.ReadAllText(HttpContext.Current.Server.MapPath(string.Format(EMAIL_TEMPLATE_PATH, EMAIL_NOTIFICATION_NAME)));
            string tableRowTemplate = File.ReadAllText(HttpContext.Current.Server.MapPath(string.Format(EMAIL_TEMPLATE_PATH, TABLE_ROW_TEMPLATE_FILE_NAME)));

            StringBuilder tableRows = new StringBuilder();
            foreach (var fieldChangeSet in fieldComparisonResponse.Values)
            {
                tableRows.Append(tableRowTemplate.Replace("{Field}", fieldChangeSet.FieldName)
                    .Replace("{From}", fieldChangeSet.OriginalValue)
                    .Replace("{To}", fieldChangeSet.NewValue));
            }

            string body = emailTemplate.Replace("{FirstName}", attendee.Profile.FirstName)
                  .Replace("{LastName}", attendee.Profile.LastName)
                  .Replace("{EventUrl}", eventUrl)
                  .Replace("{Signature}", signature)
                  .Replace("{TableRows}", tableRows.ToString());

            body = body.Replace("{Receipient}", evt.Owner.FirstName);

            // send to lead
            this.Send(evt.Owner.Email, subject, body, isBodyHtml: true);

            // send to travel, support, leads, business leads (only receive emails for their segments)
            if (evt.Users != null)
            {
                foreach (var eventUser in evt.Users.Where(x => x.Role.HasFlag(Role.Travel) || x.Role.HasFlag(Role.Support) || x.Role.HasFlag(Role.Lead)
                  || x.IsBusinessLeadForSegment(evt.Segments)))
                {
                    body = body.Replace("{Receipient}", eventUser.User.FirstName);
                    this.Send(eventUser.User.Email, subject, body, isBodyHtml: true);
                }
            }
        }


        // A new attendee has been added. RSVP request sent.
        public void SendAttendeeAddedNotifications(EventInfo evt, string username, List<string> newAttendeeList)
        {
            var subject = string.Empty;
            var body = string.Empty;

            if (newAttendeeList.Count > 1)
            {
                subject = $"Event Travel Portal | {evt.Name}: New Attendee(s) Added";

                // send to owner/lead
                body = $"Hello {evt.Owner.FirstName},\n\nThe list of attendees for {evt.Name} has been updated by {username}.\n\n" +

                $"Attendees Added: \n\n";
                for (var i = 0; i < newAttendeeList.Count; i++)
                {
                    body += $"{newAttendeeList[i]} \n";
                }

                body += $"\n View Event: {getEventUrl(evt.ID)}\n\n{getSignature(evt)}";
                this.Send(evt.Owner.Email, subject, body);
            }
            else
            {
                string newAttendee = newAttendeeList[0];
                subject = $"Event Travel Portal | {evt.Name} :{newAttendee} Added";

                body = $"Hello {evt.Owner.FirstName},\n\nThe list of attendees for {evt.Name} has been updated by {username}.\n\nView Event: {getEventUrl(evt.ID)}\n\n{getSignature(evt)}";
                this.Send(evt.Owner.Email, subject, body);
            }

           

            // send to travel, support, leads, business leads (only receive emails for their segments)
            if (evt.Users != null)
            {
                foreach (var eventUser in evt.Users.Where(x => x.Role.HasFlag(Role.Travel) || x.Role.HasFlag(Role.Support) || x.Role.HasFlag(Role.Lead)
                  || x.IsBusinessLeadForSegment(evt.Segments)))
                {
                    this.Send(eventUser.User.Email, subject, body);
                }
            }
        }

        // An attendee was removed.
        public void SendAttendeeRemovalNotification(EventInfo evt, EventAttendee attendee)
        {
            var subject = $"[Action Requested] Event Travel Portal | {evt.Name}: Your invitation has been rescinded";
            var body = $"Hello {attendee.Profile.FirstName},\n\nYour invitation to {evt.Name} has been rescinded.\n\n{getSignature(evt)}";

            if (attendee.Profile.Delegate != null)
            {
                // send to delegate, CC attendee
                this.Send(attendee.Profile.Delegate.Email, subject, body, attendee.Profile.Email);

            }
            else
            {
                // send to attendee
                this.Send(attendee.Profile.Email, subject, body);
            }
        }

        // New field added for attendees (lower priority).
        public void SendNewFieldsAddedNotification(EventAttendee attendee)
        {
            var subject = $"[Action Requested] Event Travel Portal | {attendee.Event.Name}: New Information Required";
            var body = $"Hello {attendee.Profile.FirstName},\n\nA change has been made for your required information for {attendee.Event.Name}. Please update your Attendee Details for this event by {attendee.Event.RsvpDueDate}.\n\nView Event: {getUserProfileUrl(attendee.Profile.Username)}\n\n{getSignature(attendee.Event)}";

            if (attendee.Profile.Delegate != null)
            {
                // send to delegate, CC attendee
                this.Send(attendee.Profile.Delegate.Email, subject, body, attendee.Profile.Email);
            }
            else
            {
                // send to attendee
                this.Send(attendee.Profile.Email, subject, body);
            }
        }

        // RSVP Summary
        public void SendRSVPSummary(EventInfo evt, List<EventAttendee> attendees)
        {
            if (attendees == null || evt.Users == null) return;

            var subject = $"Event Travel Portal | {evt.Name}: RSVP Summary";
            string body = "";
            var table = "Name\t\t\tRSVP\t\t\tDetails Complete?\n";

            foreach (var attendee in attendees)
            {
                var lastCommaFirst = $"{attendee.Profile.LastName}, {attendee.Profile.FirstName}";
                table += $"{lastCommaFirst,-20}\t{attendee.GetRsvpResponse(),-20}\t{(attendee.IsCompleted(evt.Fields, evt.IsPassportRequired()) ? "Yes" : "No"),-20}\n";
            }

            // send to travel, support, leads, business leads (only receive emails for their segments)
            if (evt.Users != null)
            {
                foreach (var eventUser in evt.Users.Where(x => x.Role.HasFlag(Role.Travel) || x.Role.HasFlag(Role.Support) || x.Role.HasFlag(Role.Lead)
                || x.IsBusinessLeadForSegment(evt.Segments)))
                {
                    body = $"Hello {eventUser.User.FirstName},\n\nHere is a summary of RSVP’s for {evt.Name}.\n\n{table}\nView Event: {getEventUrl(evt.ID)}\n\n{getSignature(evt)}";
                    this.Send(eventUser.User.Email, subject, body);
                }
            }

            // send to owner/lead
            body = $"Hello {evt.Owner.FirstName},\n\nHere is a summary of RSVP’s for {evt.Name}.\n\n{table}\nView Event: {getEventUrl(evt.ID)}\n\n{getSignature(evt)}";
            this.Send(evt.Owner.Email, subject, body);
        }

        // Passport Expiration Reminder
        public void SendPassportExpiringReminder(UserProfile user)
        {
            if (!user.PassportExpirationDateNear) return;

            bool isExpired = user.PassportExpirationDate.ToDateTime() < DateTime.Now;
            string subject = $"Event Travel Portal | {(isExpired ? "Passport has Expired" : "Passport Expiring Soon")}";
            string body =
                $"{user.FirstName},\n\nOur system has identified your passport {(isExpired ? "has expired" : "will expire in six months or less")}: " +
                $"{user.PassportExpirationDate.ToDateTime().ToShortDateFormat()}. In order to attend any international events, please be sure to begin the process of applying for a passport renewal." +
                $"{(isExpired ? string.Empty : "\n\n\nAs a general rule, passports should have at least six months of validity when traveling internationally.")}" +
                $"\n\n\n{getUserProfileUrl(user.Username)}";

            if (user.Delegate != null)
            {
                Send(user.Delegate.Email, subject, body, user.Email);
            }
            else
            {
                Send(user.Email, subject, body);
            }
        }
       
        private void Send(string to, string subject, string body, string cc = null, Attachment[] aAttachment = null, bool isBodyHtml = false)
        {
            Send(to, subject, body, new string[] { cc }, aAttachment, isBodyHtml);
        }

        private void Send(string to, string subject, string body, ICollection<string> cc, Attachment[] aAttachment = null, bool isBodyHtml = false)
        {
            if (!IsValidEmail(to))
            {
                return;
            }

            SmtpClient client = new SmtpClient(this.smtpServer);

            var message = new MailMessage(this.sender, to, subject, body);

            foreach (var address in cc.Where(a => !string.IsNullOrWhiteSpace(a) && IsValidEmail(a)))
            {
                message.CC.Add(address);
            }

            if (aAttachment != null)
            {
                foreach (var item in aAttachment)
                {
                    message.Attachments.Add(item);
                }
            }

            message.IsBodyHtml = isBodyHtml;

            client.Send(message);
        }

        private string getEventUrl(int eventID)
        {
            return $"{baseUrl}events/{eventID}";
        }

        private string getRSVPUrl(int attendeeID)
        {
            return $"{baseUrl}attendees/{attendeeID}";
        }

        private string getUserProfileUrl(string username)
        {
            return $"{baseUrl}attendees/{username}";
        }

        private string getSignature(EventInfo evt)
        {
            var profile = getProfile(evt.Owner.Username);
            return $"Thank you,\n\n{evt.Owner.FirstName} {evt.Owner.LastName}\n{evt.Owner.Email}\n{profile.Telephone}\nEvent Management Team\nL3Harris Technologies";
        }

        private UserProfile getProfile(string username)
        {
            return repo.GetProfile(username);
        }

        private bool IsValidEmail(string email)
        {
            var attribute = new EmailAddressAttribute();

            return attribute.IsValid(email);
        }
    }
}
