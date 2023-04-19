using System;
using System.Configuration;
using System.Data.SqlClient;

namespace TradeshowTravel.Domain
{
    using CyberArk.AIM.NetPasswordSDK;

    public class CredentialProvider
    {
        public static string CyberArkAppID
        {
            get { return ConfigurationManager.AppSettings["CyberArkAppID"]; }
        }

        private static NLog.ILogger theLogger { get; } = NLog.LogManager.GetCurrentClassLogger();

        public static string CyberArkECAObjectQuery
        {
            get { return ConfigurationManager.AppSettings["CyberArkECAObjectQuery"]; }
        }

        public static string CyberArkTradeshowObjectQuery
        {
            get { return ConfigurationManager.AppSettings["CyberArkTradeshowObjectQuery"]; }
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

                var scsb = new SqlConnectionStringBuilder(connectionString);

                if (string.IsNullOrWhiteSpace(scsb.Password) ||
                    string.IsNullOrWhiteSpace(scsb.UserID) ||
                    string.IsNullOrWhiteSpace(scsb.DataSource))
                {
                    if (string.IsNullOrWhiteSpace(CyberArkAppID))
                    {
                        theLogger.Warn($"Invalid CyberArk AppID '{CyberArkAppID}'.");
                    }
                    else if (string.IsNullOrWhiteSpace(CyberArkECAObjectQuery))
                    {
                        theLogger.Warn($"Invalid CyberArk ECA Query '{CyberArkECAObjectQuery}'.");
                    }
                    else
                    {
                        var request = new PSDKPasswordRequest();
                        request.AppID = CyberArkAppID;
                        request.Query = CyberArkECAObjectQuery;

                        var response = PasswordSDK.GetPassword(request);

                        if (response != null)
                        {
                            if (string.IsNullOrWhiteSpace(scsb.Password))
                            {
                                scsb.Password = response.Content;
                            }

                            if (string.IsNullOrWhiteSpace(scsb.UserID))
                            {
                                scsb.UserID = response.UserName;
                            }

                            if (string.IsNullOrWhiteSpace(scsb.DataSource))
                            {
                                scsb.DataSource = $"{response.Address}:{response.GetAttribute("PassProps.Port")}/{response.Database}";
                            }
                        }
                    }
                }

                return scsb.ToString();
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

                var scsb = new SqlConnectionStringBuilder(connectionString);

                if (string.IsNullOrWhiteSpace(scsb.Password) ||
                    string.IsNullOrWhiteSpace(scsb.UserID) ||
                    string.IsNullOrWhiteSpace(scsb.DataSource))
                {
                    if (string.IsNullOrWhiteSpace(CyberArkAppID))
                    {
                        theLogger.Warn($"Invalid CyberArk AppID '{CyberArkAppID}'.");
                    }
                    else if (string.IsNullOrWhiteSpace(CyberArkTradeshowObjectQuery))
                    {
                        theLogger.Warn($"Invalid CyberArk Tradeshow Query '{CyberArkTradeshowObjectQuery}'.");
                    }
                    else
                    {
                        var request = new PSDKPasswordRequest();
                        request.AppID = CyberArkAppID;
                        request.Query = CyberArkTradeshowObjectQuery;

                        var response = PasswordSDK.GetPassword(request);

                        if (response != null)
                        {
                            if (string.IsNullOrWhiteSpace(scsb.Password))
                            {
                                scsb.Password = response.Content;
                            }

                            if (string.IsNullOrWhiteSpace(scsb.UserID))
                            {
                                scsb.UserID = response.UserName;
                            }

                            if (string.IsNullOrWhiteSpace(scsb.InitialCatalog))
                            {
                                scsb.InitialCatalog = response.Database;
                            }

                            if (string.IsNullOrWhiteSpace(scsb.DataSource))
                            {
                                if (string.IsNullOrWhiteSpace(response.GetAttribute("PassProps.Port")))
                                {
                                    scsb.DataSource = response.Address;
                                }
                                else
                                {
                                    scsb.DataSource = $"{response.Address},{response.GetAttribute("PassProps.Port")}";
                                }
                            }
                        }
                    }
                }

                return scsb.ToString();
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
                theLogger.Warn($"CyberArk Object '{cyberArkObjectName}' ({CyberArkAppID}) was not found!");
                return string.Empty;
            }

            var password = response.GetAttribute("Password");

            if (string.IsNullOrWhiteSpace(password))
            {
                theLogger.Warn($"CyberArk Object '{cyberArkObjectName}' returned a null or empty string!");
            }

            return password;
        }
    }
}
