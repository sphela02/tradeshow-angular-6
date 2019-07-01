using System;
using System.Collections.Generic;
using System.Configuration;
using TradeshowTravel.ScheduledTask.Reminders;

namespace TradeshowTravel.ScheduledTask
{
    using Data;
    using Domain;
    using Domain.DTOs;
    using System.IO;

    class Program
    {
        private static IDataRepository _repo;
        private static IReminderSrv _emailSrv;

        static void Main(string[] args)
        {
            Console.WriteLine("Starting...");

            string tempFolderRoot = ConfigurationManager.AppSettings["TempFolderRoot"];

            if (string.IsNullOrWhiteSpace(tempFolderRoot))
            {
                tempFolderRoot = Path.Combine(Path.GetTempPath(), "TradeShowTravel");
            }

            _repo = new TSDataRepository();
            _emailSrv = new EmailSrv(_repo,
                ConfigurationManager.AppSettings["SmtpServer"],
                ConfigurationManager.AppSettings["SenderEmailAddress"],
                ConfigurationManager.AppSettings["BaseUrl"],
                tempFolderRoot);

            try
            {
                SendRsvpReminders();
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Unable to send RSVP reminders. Message: {ex.Message}");
            }
            
            try
            {
                SendPassportReminders();
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Unable to send passport expiration reminders. Message: {ex.Message}");
            }
        }

        static void SendRsvpReminders()
        {
            Console.WriteLine("Getting events...");

            var events = _repo.GetEvents(new QueryParams() { Skip = 0, Size = 0 }, null);

            Console.WriteLine("Iterating through events...");

            foreach (var eventItem in events.Events)
            {
                if (eventItem.StartDate <= DateTime.Now) continue;
                
                Console.WriteLine($"Processing event {eventItem.ID}.");
                
                var parameters = new QueryParams();
                parameters.Skip = Math.Max(parameters.Skip, 0);
                parameters.Size = Math.Max(parameters.Size, 0);
                parameters.Filters = new List<FilterParams>();
                parameters.Filters.Add(new FilterParams
                {
                    Field = "TradeshowID",
                    Operator = "eq",
                    Value = eventItem.ID.ToString()
                });

                var evt = _repo.GetEvent(eventItem.ID);

                // see if we should send reminders, skip if not
                if (!evt.SendReminders) continue;

                var attendees = _repo.GetEventAttendeesList(parameters);

                // send RSVP summaries on RSVP deadline date and 5 days before the show.
                if (DateTime.Now.ToShortDateString() == evt.RsvpDueDate.GetValueOrDefault().ToShortDateString() || DateTime.Now.ToShortDateString() == evt.StartDate.AddDays(-5).ToShortDateString())
                {
                    // send RSVP summaries to travel, support, and leads
                    Console.WriteLine($"Sending RSVP summaries for event {eventItem.ID}...");
                    _emailSrv.SendRSVPSummary(evt, attendees);
                }

                // send RSVP reminders once a week, until a week before the RSVP deadline (then send every day)                
                var dayDiff = (evt.RsvpDueDate.GetValueOrDefault() - DateTime.Now).Days;

                // is it 7 days prior to the RSVP deadline?
                if (dayDiff <= 7)
                {
                    // yes, so send reminder RSVPs emails
                    Console.WriteLine($"Sending reminder RSVP's for event {eventItem.ID}...");
                    _emailSrv.SendReminderRSVPs(evt, attendees);
                }
                else
                {
                    // no, so check if today is Sunday and send reminders if it is
                    if (DateTime.Now.DayOfWeek == DayOfWeek.Sunday)
                    {
                        Console.WriteLine($"Sending reminder RSVP's for event {eventItem.ID}...");
                        _emailSrv.SendReminderRSVPs(evt, attendees);
                    }
                }
            }
        }

        static void SendPassportReminders()
        {
            Console.WriteLine("Sending expiring passport reminder to users ...");

            var reminder = new PassportReminder(_repo, _emailSrv);

            var emailsSent = reminder.SendReminders();

            Console.WriteLine($"{emailsSent} reminders emails were sent to users ...");
        }
    }
}
