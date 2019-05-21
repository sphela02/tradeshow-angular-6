namespace TradeshowTravel.Data.Models
{
    using Domain.DTOs;

    public class TradeshowUser
    {
        public int ID { get; set; }
        public int TradeshowID { get; set; }
        public string Username { get; set; }
        public Role Role { get; set; }

        public virtual Tradeshow Tradeshow { get; set; }
        public virtual User User { get; set; }

        public TradeshowUser() { }
    }
}
