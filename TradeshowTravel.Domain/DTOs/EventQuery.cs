using System;
using System.Collections.Generic;

namespace TradeshowTravel.Domain.DTOs
{
    public class EventQueryResult
    {
        public EventQueryResult()
        {
            Segments = new Dictionary<string, int>();
        }

        public int Total { get; set; }
        public virtual List<EventItem> Events { get; set; }

        public int Upcoming { get; set; }
        public int Past { get; set; }
        public virtual Dictionary<string, int> Segments { get; set; }
    }

    public class EventItem
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public string Segments { get; set; }
        public string OwnerUsername { get; set; }
        public string OwnerName { get; set; }
        public int EstAttendeeCount { get; set; }
        public int ActAttendeeCount { get; set; }
        public string Status { get; set; }
    }
}
