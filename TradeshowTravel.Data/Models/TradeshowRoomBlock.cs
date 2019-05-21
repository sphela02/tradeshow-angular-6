using System;

namespace TradeshowTravel.Data.Models
{
    public class TradeshowRoomBlock
    {
        public int ID { get; set; }
        public int TradeshowID { get; set; }
        public DateTime Date { get; set; }
        public int EstRoomCount { get; set; }

        public virtual Tradeshow Tradeshow { get; set; }

        public TradeshowRoomBlock() { }
    }
}
