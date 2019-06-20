using System.Configuration;
using System.DirectoryServices;

namespace TradeshowTravel.Domain
{
    public static class LdapSrv
    {
        private static string _searchRoot = ConfigurationManager.AppSettings["LdapSearchRoot"];
        private static string _userName = ConfigurationManager.AppSettings["LdapUserName"];
        private static string _mail = ConfigurationManager.AppSettings["LdapMail"];
        private static string[] _propertiesToLoad = new[] { _userName, _mail };

        public static string GetLdapEmailAddress(string userName)
        {
            if(!string.IsNullOrWhiteSpace(userName))
            {
                using (var dirEntry = new DirectoryEntry(_searchRoot))
                {
                    using (var searcher = new DirectorySearcher(dirEntry, $"({_userName}={userName})", _propertiesToLoad, SearchScope.Subtree))
                    {
                        SearchResult result = searcher.FindOne();

                        return result?.Properties[_mail]?[0]?.ToString() ?? string.Empty;
                    }
                } 
            }

            return string.Empty;
        }
    }
}