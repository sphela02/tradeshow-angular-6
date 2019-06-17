using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;

namespace TradeshowTravel.Domain
{
    using Domain.DTOs;
    using System.IO;
    using System.Web;

    public class EmailSrv
    {
        private readonly string smtpServer = "mail.harris.com";
        private readonly string sender = "noreply-eventtravelportal@harris.com";
        private readonly string baseUrl = "https://tradeshowtravel.harris.com/";
        private IDataRepository repo = null;

        public EmailSrv(IDataRepository repo)
        {
            this.repo = repo;
        }

        public EmailSrv(IDataRepository repo, string smtpServer, string sender, string baseUrl)
        {
            this.repo = repo;
            this.smtpServer = smtpServer;
            this.sender = sender;
            this.baseUrl = baseUrl;
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
            var subject = $"[Action Requested] Event Travel Portal | RSVP: You have been invited to attend {evt.Name}";

            var body = req.EmailText.Replace("<EventAttendee.Name>", attendee.Profile.FirstName)
                .Replace("<Event.RsvpDueDate>", req.DueDate.ToShortDateString())
                .Replace("<Page: EventInfo.Name>", getRSVPUrl(attendee.ID))
                .Replace("<EventInfo.Name>", evt.Name);

            List<Attachment> attachments = new List<Attachment>();
            for(int i  =0; i< req.Attachments.Count; i++)
            {
                attachments.Add(new Attachment(req.Attachments[i].InputStream, req.Attachments[i].FileName));
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
            var body = $"{attendee.Profile.FirstName},\n\nWelcome to the Event Travel Portal.  This portal is used for all tradeshow attendees to plan your travel details(like hotel).  Your profile is auto populated from PeopleFluent.  Once your profile is complete, it will be saved for future shows.  Any PII entered is only viewable by event portal admins and secured according to Harris policy.\n\nOnce you have been entered for a show, you will receive an e-mail with a link and instructions to enter the required fields.  Be mindful that the dates you enter into the system are the dates you will be confirmed through our hotel block.\n\nDelegates will be assigned automatically for VP and above but anyone can assign a delegate in your profile.  Both you and your delegate will receive all e-mails from the travel portal.\n\n{getSignature(evt)}";
            var documentsRootPath = HttpContext.Current.Server.MapPath(@"~\App_Data");

            Attachment attachment1 = new Attachment(Path.Combine(documentsRootPath, "EventTravelPortal_QuickStartGuide_Attendee.pdf"));
            Attachment attachment2 = new Attachment(Path.Combine(documentsRootPath, "EventTravelPortal_UserManual_Attendee.pptx"));

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
            var subject = $"Event Travel Portal | {{attendee.Event.Name}}: Attendance Declined";
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

        // attendee updated their info.
        public void SendUserDetailsUpdatedNotification(EventInfo evt, EventAttendee attendee)
        {
            var subject = $"Event Travel Portal | {evt.Name}: Attendee information has been updated";
            var body = $"Hello {evt.Owner.FirstName},\n\n{attendee.Profile.FirstName} {attendee.Profile.LastName} has updated their Attendee Details or has canceled.\n\nView Event: {getEventUrl(attendee.EventID)}\n\n{getSignature(evt)}";

            // send to lead
            this.Send(evt.Owner.Email, subject, body);

            // send to travel, support, leads, business leads (only receive emails for their segments)
            if (evt.Users != null)
            {
                foreach (var eventUser in evt.Users.Where(x => x.Role.HasFlag(Role.Travel) || x.Role.HasFlag(Role.Support) || x.Role.HasFlag(Role.Lead)
                  || x.IsBusinessLeadForSegment(evt.Segments)))
                {
                    body = $"Hello {eventUser.User.FirstName},\n\n{attendee.Profile.FirstName} {attendee.Profile.LastName} has updated their Attendee Details or has canceled.\n\nView Event: {getEventUrl(attendee.EventID)}\n\n{getSignature(evt)}";
                    this.Send(eventUser.User.Email, subject, body);
                }
            }
        }

        // A new attendee has been added. RSVP request sent.
        public void SendAttendeeAddedNotifications(EventInfo evt, string username)
        {
            var subject = $"Event Travel Portal | {evt.Name}: New Attendee(s) Added";

            // send to owner/lead
            var body = $"Hello {evt.Owner.FirstName},\n\nThe list of attendees for {evt.Name} has been updated by {username}.\n\nView Event: {getEventUrl(evt.ID)}\n\n{getSignature(evt)}";
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

        private void Send(string to, string subject, string body, string cc = null, Attachment[] aAttachment = null)
        {
            SmtpClient client = new SmtpClient(this.smtpServer);
            var message = new MailMessage(this.sender, to, subject, body);

            if (!string.IsNullOrWhiteSpace(cc))
            {
                message.CC.Add(cc);
            }

            if (aAttachment != null)
            {
                foreach (var item in aAttachment)
                {
                    message.Attachments.Add(item);
                }
            }

            client.Send(message);
        }

        private void Send(string to, string subject, string body, ICollection<string> cc, Attachment[] aAttachment = null)
        {
            SmtpClient client = new SmtpClient(this.smtpServer);

            var message = new MailMessage(this.sender, to);
            message.Subject = subject;
            message.Body = body;

            foreach (var address in cc)
            {
                message.CC.Add(address);
            }

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
            return $"Thank you,\n\n{evt.Owner.FirstName} {evt.Owner.LastName}\n{evt.Owner.Email}\n{profile.Telephone}\nEvent Management Team\nHarris Corporation";
        }

        private UserProfile getProfile(string username)
        {
            return repo.GetProfile(username);
        }

        //public void test(string body = null)
        //{
        //    if(body == null)
        //        this.Send("rcrum@harris.com", "test", "test");
        //    else
        //        this.Send("rcrum@harris.com", "test", body);
        //}
    }
}
