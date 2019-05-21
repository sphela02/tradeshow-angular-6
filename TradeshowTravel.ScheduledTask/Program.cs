using System;
using System.Collections.Generic;
using System.Configuration;

namespace TradeshowTravel.ScheduledTask
{
    using Data;
    using Domain;
    using Domain.DTOs;

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Starting...");
            
            IDataRepository repo = new TSDataRepository();

            EmailSrv EmailSrv = new EmailSrv(
                repo,
                ConfigurationManager.AppSettings["SmtpServer"],
                ConfigurationManager.AppSettings["SenderEmailAddress"],
                ConfigurationManager.AppSettings["BaseUrl"]
            );

            Console.WriteLine("Getting events...");

            var events = repo.GetEvents(new QueryParams() { Skip = 0, Size = 0 }, null);

            Console.WriteLine("Iterating through events...");

            foreach (var eventItem in events.Events)
            {
                if (eventItem.StartDate <= DateTime.Now) continue;
                //if (eventItem.ID != 26) continue;

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

                var evt = repo.GetEvent(eventItem.ID);

                // see if we should send reminders, skip if not
                if (!evt.SendReminders) continue;

                var attendees = repo.GetEventAttendeesList(parameters);

                // send RSVP summaries on RSVP deadline date and 5 days before the show.
                if (DateTime.Now.ToShortDateString() == evt.RsvpDueDate.GetValueOrDefault().ToShortDateString() || DateTime.Now.ToShortDateString() == evt.StartDate.AddDays(-5).ToShortDateString())
                {
                    // send RSVP summaries to travel, support, and leads
                    Console.WriteLine($"Sending RSVP summaries for event {eventItem.ID}...");
                    EmailSrv.SendRSVPSummary(evt, attendees);
                }

                // send RSVP reminders once a week, until a week before the RSVP deadline (then send every day)                
                var dayDiff = (evt.RsvpDueDate.GetValueOrDefault() - DateTime.Now).Days;

                // is it 7 days prior to the RSVP deadline?
                if (dayDiff <= 7)
                {
                    // yes, so send reminder RSVPs emails
                    Console.WriteLine($"Sending reminder RSVP's for event {eventItem.ID}...");
                    EmailSrv.SendReminderRSVPs(evt, attendees);
                }
                else
                {
                    // no, so check if today is Sunday and send reminders if it is
                    if (DateTime.Now.DayOfWeek == DayOfWeek.Sunday)
                    {
                        Console.WriteLine($"Sending reminder RSVP's for event {eventItem.ID}...");
                        EmailSrv.SendReminderRSVPs(evt, attendees);
                    }
                }
            }
        }
    }
}
