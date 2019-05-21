using System.Collections.Generic;

namespace TradeshowTravel.Domain
{
    using DTOs;

    public interface IUserProfileQuery
    {
        UserProfile GetProfile(string username);

        List<UserInfo> GetUsers(
            string username,
            string last,
            string first,
            int size = 0,
            int skip = 0);
    }
}
