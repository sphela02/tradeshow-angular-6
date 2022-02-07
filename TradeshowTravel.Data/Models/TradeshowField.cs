using System.Collections.Generic;

namespace TradeshowTravel.Data.Models
{
    using Domain.DTOs;

    public class TradeshowField
    {
        public TradeshowField()
        {
            AttendeeValues = new HashSet<AttendeeValue>();
        }
        
        public int ID { get; set; }
        public int TradeshowID { get; set; }
        public string Label { get; set; }
        public string Input { get; set; }
        public string Source { get; set; }
        public string Tooltip { get; set; }
        public int Order { get; set; }
        public string Options { get; set; }
        public string Format { get; set; }
        public bool Required { get; set; }
        public bool Included { get; set; }
        public Role Access { get; set; }
        
        public virtual Tradeshow Tradeshow { get; set; }
        public virtual ICollection<AttendeeValue> AttendeeValues { get; set; }
    }
}
