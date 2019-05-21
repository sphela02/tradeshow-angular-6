namespace TradeshowTravel.Domain.DTOs
{
    public class ReminderRequest
    {
        public int[] AttendeeIDs { get; set; }
        public string EmailText { get; set; }
    }
}
