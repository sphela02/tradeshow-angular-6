using System;
using System.Configuration;
using System.Data.SqlClient;

namespace TradeshowTravel.Domain
{
    using Common.Logging;
    using CyberArk.AIM.NetPasswordSDK;

    public class CredentialProvider
    {
        public static string CyberArkAppID
        {
            get { return ConfigurationManager.AppSettings["CyberArkAppID"]; }
        }

        public static string CyberArkECAObjectName
        {
            get { return ConfigurationManager.AppSettings["CyberArkECAObjectName"]; }
        }

        public static string CyberArkTradeshowObjectName
        {
            get { return ConfigurationManager.AppSettings["CyberArkTradeshowObjectName"]; }
        }

        public static string DBEncryptionPassword
        {
            get
            {
                string retval = ConfigurationManager.AppSettings["DBEncryptionPassword"];

                if (string.IsNullOrWhiteSpace(retval))
                {
                    // Ask CyberArk for the Encryption Password
                    retval = GetPassword(ConfigurationManager.AppSettings["CyberArkTradeshowEncryptPwd"]);
                }

                return retval;
            }
        }

        public static string ECAConnectionString
        {
            get
            {
                var setting = ConfigurationManager.ConnectionStrings["ECADB"];
                if (setting == null)
                {
                    return null;
                }

                var connectionString = setting.ConnectionString;
                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    return connectionString;
                }

                var connStrBuilder = new SqlConnectionStringBuilder(connectionString);

                if (string.IsNullOrWhiteSpace(connStrBuilder.Password))
                {
                    connStrBuilder.Password = GetPassword(CyberArkECAObjectName);
                }

                return connStrBuilder.ToString();
            }
        }

        public static string TSTConnectionString
        {
            get
            {
                var setting = ConfigurationManager.ConnectionStrings["TSTDB"];
                if (setting == null)
                {
                    return null;
                }

                var connectionString = setting.ConnectionString;
                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    return connectionString;
                }

                var connStrBuilder = new SqlConnectionStringBuilder(connectionString);

                if (string.IsNullOrWhiteSpace(connStrBuilder.Password))
                {
                    connStrBuilder.Password = GetPassword(CyberArkTradeshowObjectName);
                }

                return connStrBuilder.ToString();
            }
        }

        private static string GetPassword(string cyberArkObjectName)
        {
            if (string.IsNullOrWhiteSpace(cyberArkObjectName) || string.IsNullOrWhiteSpace(CyberArkAppID))
            {
                return string.Empty;
            }

            var request = new PSDKPasswordRequest();
            request.SetAttribute("AppDescs.AppID", CyberArkAppID);
            request.SetAttribute("Query", $"Object={cyberArkObjectName}");

            var response = PasswordSDK.GetPassword(request);

            if (response == null)
            {
                Logging.LogMessage(LogLevel.Warning, $"CyberArk Object '{cyberArkObjectName}' ({CyberArkAppID}) was not found!");
                return string.Empty;
            }

            var password = response.GetAttribute("Password");

            if (string.IsNullOrWhiteSpace(password))
            {
                Logging.LogMessage(LogLevel.Warning, $"CyberArk Object '{cyberArkObjectName}' returned a null or empty string!");
            }

            return password;
        }
    }
}
