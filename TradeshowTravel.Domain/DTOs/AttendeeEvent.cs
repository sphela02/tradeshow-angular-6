using System;

namespace TradeshowTravel.Domain.DTOs
{
    public class AttendeeEvent
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string DelegateName { get; set; }
        public string DelegateUsername { get; set; }
        public int EventID { get; set; }
        public string EventName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public AttendeeStatus Status { get; set; }
        public bool IsComplete { get; set; }
    }
}
