using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace TradeshowTravel.ECA
{
    using Configurations;
    using Domain;
    using Domain.DTOs;
    using Models;
    using Oracle.ManagedDataAccess.Client;

    public class ECAUserRepository : DbContext, IUserProfileQuery
    {
        public ECAUserRepository() : base(new OracleConnection(CredentialProvider.ECAConnectionString), true)
        {
            Database.SetInitializer<ECAUserRepository>(null);
        }

        public virtual DbSet<Associate> Associates { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new AssociateConfig());
        }

        public UserProfile GetProfile(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            UserProfile profile = null;
            
            username = username.Trim().ToUpper();
            foreach (var associate in Associates
                .Where(a => a.Username == username))
            {
                if (Associate.ACTIVE_STATUSES.Contains(associate.Status) ||
                    profile == null)
                {
                    profile = new UserProfile
                    {
                        Username = associate.Username,
                        EmplID = associate.EmplID,
                        FirstName = associate.FirstName,
                        LastName = associate.LastName,
                        Email = associate.Email,
                        Segment = associate.Segment ?? (associate.Company != null ? associate.Company.Trim() : ""),
                        Title = associate.Title,
                        Mobile = associate.Mobile,
                        Telephone = associate.Telephone,
                        BadgeName = associate.FirstName + " " + associate.LastName,
                        ShowPicture = string.IsNullOrWhiteSpace(associate.EmplID) ? false : associate.ShowPicture
                    };
                }
            }

            return profile;
        }
        
        List<UserInfo> IUserProfileQuery.GetUsers(string username, string last, string first, int size, int skip)
        {
            var query = this.Associates.Where(a => Associate.ACTIVE_STATUSES.Contains(a.Status));

            if (!string.IsNullOrWhiteSpace(username))
            {
                username = username.Trim().ToUpper();
                query = query.Where(a => a.Username.StartsWith(username));
            }

            if (!string.IsNullOrWhiteSpace(last) && !string.IsNullOrWhiteSpace(first) && first == last)
            {
                first = first.Trim().MakePropperCase();
                last = last.Trim().MakePropperCase();

                query = query.Where(a => a.Last.StartsWith(last) || a.PreferredLast.StartsWith(last) ||
                            a.First.StartsWith(first) || a.PreferredFirst.StartsWith(first));
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(last))
                {
                    last = last.Trim().MakePropperCase();
                    query = query.Where(a => a.Last.StartsWith(last) || a.PreferredLast.StartsWith(last));
                }

                if (!string.IsNullOrWhiteSpace(first))
                {
                    first = first.Trim().MakePropperCase();
                    query = query.Where(a => a.First.StartsWith(first) || a.PreferredFirst.StartsWith(first));
                }
            }

            query = query.OrderBy(a => a.PreferredLast)
                .ThenBy(a => a.Last)
                .ThenBy(a => a.PreferredFirst)
                .ThenBy(a => a.First);

            if (skip > 0)
            {
                query = query.Skip(skip).Take(size);
            }
            else if (size > 0)
            {
                query = query.Take(size);
            }

            List<UserInfo> users = new List<UserInfo>();

            foreach (var a in query)
            {
                users.Add(new UserInfo
                {
                    Username = a.Username,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Segment = a.Segment ?? (a.Company != null ? a.Company.Trim() : string.Empty),
                    Email = a.Email
                });
            }

            return users;
        }
    }

    public static class Extensions
    {

        public static string MakePropperCase(this string str)
        {
            if (!string.IsNullOrWhiteSpace(str))
            {
                if (str.Length > 1)
                {
                   return char.ToUpperInvariant(str[0]).ToString() + str.Substring(1).ToLower();
                }
                else
                {
                    return char.ToUpperInvariant(str[0]).ToString();
                }
            }

            return str;
        }
    }
    
}
