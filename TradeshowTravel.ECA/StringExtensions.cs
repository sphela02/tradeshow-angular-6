using System.Configuration;

namespace TradeshowTravel.ECA
{
    public static class StringExtensions
    {
        public static string NormalizeEmail(this string emailInEca)
        {
            if (string.IsNullOrWhiteSpace(emailInEca))
            {
                return null;
            }

            return emailInEca.Contains("@") ? emailInEca : emailInEca + ConfigurationManager.AppSettings["Domain"];
        }
    }
}
