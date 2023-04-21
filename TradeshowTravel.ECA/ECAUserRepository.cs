using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using TradeshowTravel.Domain;
using TradeshowTravel.Domain.DTOs;
using TradeshowTravel.ECA.Models;

namespace TradeshowTravel.ECA
{
    public class ECAUserRepository : IUserProfileQuery
    {
        private ILogger theLogger { get; }

        private string EcaBaseUrl
        {
            get { return ConfigurationManager.AppSettings["ECA_Url"]; }
        }

        public ECAUserRepository()
        {
            theLogger = LogManager.GetCurrentClassLogger();
        }

        public UserProfile GetProfile(string username)
        {
            var url = $"{EcaBaseUrl}{GetAssociateByEcaIdParams.METHOD_NAME}";

            var @params = new GetAssociateByEcaIdParams()
            {
                ecaId = username
            };

            var data = JsonConvert.SerializeObject(@params);

            try
            {
                using (var client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    var response = client.UploadString(url, data);

                    var associate = JsonConvert.DeserializeObject<Associate>(response);

                    if (associate == null)
                    {
                        theLogger.Error($"Error '{response}' querying '{url}' with data: {data}");
                    }
                    else
                    {
                        return new UserProfile()
                        {
                            Username = associate.EcaId,
                            EmplID = associate.EmployeeId,
                            FirstName = associate.FirstName,
                            LastName = associate.LastName,
                            Email = associate.Email,
                            Title = associate.Title,
                            Segment = associate.SegmentCode,
                            Telephone = associate.PhoneNumbers?.Where(x => x.PhoneTypeText == "Office1").Select(x => x.Number).FirstOrDefault(),
                            Mobile = associate.PhoneNumbers?.Where(x => x.PhoneTypeText == "Mobile").Select(x => x.Number).FirstOrDefault(),
                            ShowPicture = associate.ShowPicture,
                            BadgeName = $"{associate.FirstName} {associate.LastName}"
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                theLogger.Error(ex, $"Error querying [{url}] with data: {data}");
            }

            return null;
        }

        public List<UserInfo> GetUsers(string username, string last, string first, int size = 0, int skip = 0)
        {
            var users = new List<UserInfo>();

            var url = $"{EcaBaseUrl}{AssociateSearchParams.METHOD_NAME}";

            var @params = new AssociateSearchParams()
            {
                searchTerm = string.IsNullOrWhiteSpace(username) ? $"{first} {last}".Trim() : username.Trim()
            };

            var data = JsonConvert.SerializeObject(@params);

            try
            {
                using (var client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    var response = client.UploadString(url, data);

                    var associates = JsonConvert.DeserializeObject<List<Associate>>(response) ?? new List<Associate>();

                    users.AddRange(associates.Select(a => new UserInfo()
                    {
                        Username = a.EcaId,
                        FirstName = a.FirstName,
                        LastName = a.LastName,
                        Email = a.Email,
                        Segment = a.SegmentCode
                    }));
                }
            }
            catch (Exception ex)
            {
                theLogger.Error(ex, $"Error querying '{url}' with data:  {data}");
            }

            return users;
        }
    }
}
