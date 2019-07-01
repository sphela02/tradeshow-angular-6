using System.Collections.Generic;
using TradeshowTravel.Domain.DTOs;

namespace TradeshowTravel.Domain
{
    public interface IReminderSrv
    {
        void SendReminderRSVPs(EventInfo evt, List<EventAttendee> attendees);

        void SendRSVPSummary(EventInfo evt, List<EventAttendee> attendees);

        void SendPassportExpiringReminder(UserProfile user);
    }
}
