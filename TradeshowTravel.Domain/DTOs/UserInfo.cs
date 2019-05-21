namespace TradeshowTravel.Domain.DTOs
{
    public class UserInfo
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Segment { get; set; }
        public string Email { get; set; }

        public string DisplayName
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Segment))
                {
                    return $"{FirstName} {LastName} ({Username.ToLower()})";
                }
                else
                {
                    return $"{FirstName} {LastName} ({Username.ToLower()}, {Segment})";
                }
            }
            set { }
        }
    }
}
