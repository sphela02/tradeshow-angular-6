using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Web;

namespace Common.Logging
{
    public class DatabaseLogWriter : BaseLogWriter
    {
        public string ConnectionString { get; set; }

        public DatabaseLogWriter(
            string loggerName, 
            string connectionString,
            LogLevel maxLogLevel = LogLevel.Trace) : base()
        {
            this.Name = loggerName;
            this.ConnectionString = connectionString;
            this.MaxLevel = maxLogLevel;
        }

        protected override void InternalWriteMessage(LogLevel level, string appName, string filename, int line, string subsystem, string function, string message)
        {
            if (message == null)
            {
                return;
            }
            else if (String.IsNullOrWhiteSpace(this.ConnectionString))
            {
                return;
            }

            string user = null, domain = null, username = null;

            if (HttpContext.Current != null && HttpContext.Current.User.Identity.IsAuthenticated)
            {
                user = HttpContext.Current.User.Identity.Name.Trim(new char[] { '\\', '/', '@', ' ', '\n' });
            }
            else if (WindowsIdentity.GetCurrent() != null)
            {
                user = WindowsIdentity.GetCurrent().Name.Trim(new char[] { '\\', '/', '@', ' ', '\n' });
            }

            string[] pair = user.Split(new char[] { '\\', '/' }, 2, StringSplitOptions.RemoveEmptyEntries);

            if (pair.Length == 2)
            {
                domain = pair[0].Trim();
                username = pair[1].Trim();
            }
            else
            {
                pair = user.Split(new char[] { '@' }, 2, StringSplitOptions.RemoveEmptyEntries);

                if (pair.Length == 2)
                {
                    username = pair[0].Trim();
                    domain = pair[1].Trim();
                }
                else
                {
                    username = domain = user;
                }
            }

            lock (this.Mutex)
            {
                using (SqlConnection connection = new SqlConnection(this.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand(null, connection))
                    {
                        command.CommandText = "insert into [EventLog] (AppName, Severity, LogDateTime, LogMessage, ClientIP, UserDomain, UserName, ClientBrowserInfo, WebServerIP, UrlHostName, UrlPathInfo, UrlQueryString, ExtraInfo) values(@AppName, @Severity, getdate(), @LogMessage, @ClientIP, @UserDomain, @UserName, @ClientBrowserInfo, @WebServerIP, @UrlHostName, @UrlPathInfo, @UrlQueryString, @ExtraInfo);";

                        command.Parameters.Add("@AppName", SqlDbType.NVarChar, 100).Value = appName;
                        command.Parameters.Add("@Severity", SqlDbType.NVarChar, 10).Value = level.ToString();
                        command.Parameters.Add("@LogMessage", SqlDbType.NVarChar).Value = message.Trim();
                        
                        if (HttpContext.Current != null && HttpContext.Current.Request != null)
                        {
                            command.Parameters.Add("@ClientIP", SqlDbType.NVarChar, 25).Value = HttpContext.Current.Request.UserHostAddress.Trim();
                            command.Parameters.Add("@ClientBrowserInfo", SqlDbType.NVarChar, 300).Value = HttpContext.Current.Request.UserAgent.Trim();
                            command.Parameters.Add("@WebServerIP", SqlDbType.NVarChar, 25).Value = HttpContext.Current.Request.ServerVariables["LOCAL_ADDR"];
                            command.Parameters.Add("@UrlHostName", SqlDbType.NVarChar, 200).Value = HttpContext.Current.Request.Url.Host;
                            command.Parameters.Add("@UrlPathInfo", SqlDbType.NVarChar, 500).Value = HttpContext.Current.Request.PathInfo;
                            command.Parameters.Add("@UrlQueryString", SqlDbType.NVarChar, 4000).Value = HttpContext.Current.Request.Url.Query;
                        }
                        else
                        {
                            command.Parameters.Add("@ClientIP", SqlDbType.NVarChar, 25).Value = DBNull.Value;
                            command.Parameters.Add("@ClientBrowserInfo", SqlDbType.NVarChar, 300).Value = Environment.OSVersion.ToString();
                            command.Parameters.Add("@WebServerIP", SqlDbType.NVarChar, 25).Value = DBNull.Value;
                            command.Parameters.Add("@UrlHostName", SqlDbType.NVarChar, 200).Value = Environment.MachineName;
                            command.Parameters.Add("@UrlPathInfo", SqlDbType.NVarChar, 500).Value = System.Reflection.Assembly.GetEntryAssembly().Location;
                            command.Parameters.Add("@UrlQueryString", SqlDbType.NVarChar, 4000).Value = DBNull.Value;
                        }

                        command.Parameters.Add("@UserDomain", SqlDbType.NVarChar, 20).Value = domain;
                        command.Parameters.Add("@UserName", SqlDbType.NVarChar, 20).Value = username;

                        // Add remaining values to extra info
                        StringBuilder sb = new StringBuilder();

                        using (System.IO.StringWriter w = new System.IO.StringWriter(sb))
                        {
                            w.Write("PID={0}; ", System.Diagnostics.Process.GetCurrentProcess().Id);
                            w.Write("ThreadId={{0x{0}}}; ", System.Threading.Thread.CurrentThread.ManagedThreadId.ToString("x8"));

                            if (!String.IsNullOrWhiteSpace(subsystem))
                            {
                                w.Write("SubSystem={0}; ", subsystem);
                            }

                            if (!String.IsNullOrWhiteSpace(filename))
                            {
                                w.Write("filename={0}; ", filename);
                            }

                            w.Write("line={0}; ", line);

                            if (!String.IsNullOrWhiteSpace(function))
                            {
                                w.Write("method={0}; ", function);
                            }
                        }

                        command.Parameters.Add("@ExtraInfo", SqlDbType.NVarChar).Value = sb.ToString().Trim();

                        command.Connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
            }
        }
    }
}
