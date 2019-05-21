namespace TradeshowTravel.Data.Models
{
    public class AttendeeValue
    {
        public int ID { get; set; }
        public int AttendeeID { get; set; }
        public int TradeshowFieldID { get; set; }
        public string Value { get; set; }

        public virtual TradeshowField TradeshowField { get; set; }
        public virtual Attendee Attendee { get; set; }
    }
}
