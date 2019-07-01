using System;
using System.Collections.Generic;
using System.Linq;

namespace TradeshowTravel.Data
{
    using Domain;
    using Domain.DTOs;
    using Models;

    public class TSDataRepository : IDataRepository
    {
        private TSTDB DB { get; set; }
        
        public TSDataRepository()
        {
            DB = new TSTDB();
        }

        #region User Images

        public void SaveImage(string username, byte[] imagebyte, string imgtype, string category, string description)
        {
            var picRec = this.DB.UserImages.Find(username, category);

            if (picRec == null)
            {
                picRec = new UserImages();
                picRec.Username = username;
                picRec.Image = imagebyte;
                picRec.ImageType = imgtype;
                picRec.Category = category;
                picRec.Description = description;

                this.DB.UserImages.Add(picRec);
            }
            else if (category.ToUpper() == "AVATAR")
            {
                picRec.Username = username;
                picRec.Image = imagebyte;
                picRec.ImageType = imgtype;
                picRec.Category = category;
                picRec.Description = description;
            }

                this.DB.SaveChanges();
        }

        //public void SaveImages(List<UserImages> docs)
        //{
        //    if (docs == null)
        //    {
        //        return;
        //    }

        //    List<string> keepers = new List<string>();

        //    // Add or Delete (control of unique key (username + catalog) is done via angular code)
        //    // No updating
        //    foreach (var d in docs)
        //    {
        //        if (d.Image == null)
        //        {
        //            continue;
        //        }
  
        //        var picRec = this.DB.UserImages.Find(d.Username.ToUpper(), d.Category.ToUpper());

        //        if (picRec == null)
        //        {
        //            picRec = new UserImages();
        //            picRec.Username = d.Username.ToUpper();

                    
        //            picRec.Image = d.Image;
        //            picRec.ImageType = d.ImageType;
        //            picRec.Category = d.Category.ToUpper();
        //            picRec.Description = d.Description;

        //            this.DB.UserImages.Add(picRec);
        //        }
        //        keepers.Add(d.Category.ToUpper());
        //    }

        //    //Remove docs 
        //    foreach (var doc in this.DB.UserImages
        //             .Where (ui => ui.Username == docs[0].Username.ToUpper())
        //             .Where (ui => !keepers.Contains(ui.Category))
        //             .Where (ui => ui.Category != "AVATAR"))
        //    {
        //        this.DB.UserImages.Remove(doc);
        //    }

        //    this.DB.SaveChanges();
        //}

        public void DeleteImages(string username, List<string> categories)
        {
            if (categories == null)
            {
                return;
            }

            // Delete (control of unique key (username + catalog) is done via angular code)
            foreach (var c in categories)
            {
                
                var picRec = this.DB.UserImages.Find(username.ToUpper(), c.ToUpper());

                if (picRec == null)
                {
                    continue;
                }
                this.DB.UserImages.Remove(picRec);
            }

            this.DB.SaveChanges();
        }


        public UserImages GetAvatar(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            var query = this.DB.UserImages
               .Where(u => u.Username == username && u.Category == "AVATAR")
               .FirstOrDefault();

            if (query == null)
            {
                return null;
            }

            return query;
        }

        public List<UserImages> GetTravelDocs(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            return this.DB.UserImages
                .Where(u => u.Username == username && u.Category != "AVATAR")
                .OrderBy(u => u.Category)
                .ToList();
        }

        #endregion

        #region Segments

        public List<string> GetSegments()
        {
            return this.DB.Segments
                .Select(s => s.Name)
                .OrderBy(s => s)
                .ToList();
        }

        #endregion

        #region Security

        public Role GetUserRole(int eventID, string username)
        {
            if (eventID < 0 || string.IsNullOrWhiteSpace(username))
            {
                return Role.None;
            }

            var role = Role.None;

            var evt = DB.Tradeshows.Include("Users")
                .Where(e => e.ID == eventID)
                .FirstOrDefault();

            if (evt != null)
            {
                if (evt.OwnerUsername.Equals(username, StringComparison.OrdinalIgnoreCase))
                {
                    role |= Role.Lead;
                }

                foreach (var user in evt.Users.Where(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase)))
                {
                    role |= user.Role;
                }
            }

            return role;
        }

        public bool HasUserRole(int eventID, string username, Role role)
        {
            if (eventID < 0 || string.IsNullOrWhiteSpace(username) || role == Role.None)
            {
                return false;
            }

            return DB.Tradeshows
                .Where(e => e.ID == eventID)
                .Where(e => (e.OwnerUsername == username && role == Role.Lead) ||
                       e.Users.Any(u => u.Username == username && u.Role == role))
                .Any();
        }

        #endregion

        #region User Profiles

        public List<UserProfile> GetActiveUsersWithExpiringPassport()
        {
            return DB.Attendees
                .Include("Tradeshow")
                .Include("User")
                .Include("User.Delegate")
                .Where(x => x.Tradeshow.StartDate > DateTime.Now && x.SendRSVP)
                .Select(x => x.User.ToUserProfile(true))
                .Where(x => x.PassportExpirationDateNear)
                .Distinct()
                .ToList();
        }

        public UserProfile GetProfile(string username, string identityUser = null)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            var query = this.DB.Users
                .Include("Delegate")
                .Where(u => u.Username == username);

            if (!string.IsNullOrWhiteSpace(identityUser))
            {
                query = query.Where(
                    u => u.Username == identityUser ||
                         u.DelegateUsername == identityUser ||
                         u.Attendees.Any(
                             a => a.Tradeshow.OwnerUsername == identityUser ||
                                  a.Tradeshow.Users.Any(
                                      x => x.Username == identityUser
                                      )));
            }

            var user = query.FirstOrDefault();

            if (user == null)
            {
                return null;
            }

            var profile = user.ToUserProfile();

            var roles = this.DB.TradeshowUsers
                .Where(u => u.Username == username)
                .Select(u => u.Role)
                .Distinct();

            foreach (var role in roles)
            {
                profile.Role |= role;
            }

            return profile;
        }

        public List<UserProfile> GetProfilesWithPrivileges(Permissions privilege)
        {
            List<UserProfile> users = new List<UserProfile>();

            var query = DB.Users
                .Include("Delegate")
                .AsQueryable();

            if (privilege == Permissions.None)
            {
                query = query.Where(u => u.Privileges != Permissions.None);
            }
            else
            {
                query = query.Where(u => u.Privileges == privilege);
            }

            foreach (var user in query.OrderBy(u => u.Username))
            {
                users.Add(user.ToUserProfile(false));
            }

            return users;
        }

        public UserProfile GetUserDelegate(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            var user = this.DB.Users
                .Where(u => u.Username == username)
                .Select(u => u.Delegate)
                .FirstOrDefault();

            if (user == null)
            {
                return null;
            }

            return user.ToUserProfile();
        }

        public UserProfile SaveProfile(UserProfile profile)
        {
            var user = this.DB.Users.Find(profile.Username);

            if (user == null)
            {
                user = new User();
                user.Username = profile.Username;
                this.DB.Users.Add(user);
            }

            if (string.IsNullOrWhiteSpace(profile.DelegateUsername))
            {
                profile.DelegateUsername = null;
            }

            user.DelegateUsername = profile.DelegateUsername;
            user.EmplID = profile.EmplID;
            user.FirstName = profile.FirstName;
            user.LastName = profile.LastName;
            user.Title = profile.Title;
            user.Segment = profile.Segment;
            user.Email = profile.Email;
            user.Telephone = profile.Telephone;
            user.Mobile = profile.Mobile;
            user.BadgeName = profile.BadgeName;
            user.Privileges = profile.Privileges;
            user.PassportName = profile.PassportName;
            user.PassportNumber = profile.PassportNumber;
            user.PassportExpirationDate = profile.PassportExpirationDate.ToDTOFormat();
            user.Nationality = profile.Nationality;
            user.DOB = profile.DOB.ToDTOFormat();
            user.COB = profile.COB;
            user.COR = profile.COR;
            user.COI = profile.COI;

            this.DB.SaveChanges();

            return GetProfile(profile.Username);
        }

        public bool IsUserNew(string username)
        {
            return !DB.Attendees.Any(x => x.Username == username && x.SendRSVP);
        }

        #endregion

        #region Events
        
        public EventInfo GetEvent(int eventID)
        {
            var evt = this.DB.Tradeshows
                .Include("Owner")
                .Include("Users")
                .Include("Fields")
                .Include("RoomBlocks")
                .Where(t => t.ID == eventID)
                .FirstOrDefault();

            if (evt == null)
            {
                return null;
            }
            
            EventInfo eventInfo = evt.ToEventInfo();

            return eventInfo;
        }

        public EventQueryResult GetEvents(QueryParams parameters, string identityUser = null)
        {
            var query = DB.Tradeshows.AsQueryable();

            if (!string.IsNullOrWhiteSpace(identityUser))
            {
                query = query.Where(t => t.OwnerUsername == identityUser || t.Users.Any(u => u.Username == identityUser));
            }

            // Handle Filters
            query = query.HandleEventQueryFilters(parameters.Filters);

            var subquery = query;

            // Handle Sorting
            query = query.HandleEventQuerySorts(parameters.Sort);

            EventQueryResult result = new EventQueryResult();

            // Consider shows on or prior to today as 'Past'
            DateTime deadline = DateTime.Now.Date.AddDays(1);

            // Get the events for our page
            result.Events= query
                .Skip(parameters.Skip)
                .Take(parameters.Size)
                .Select(t => new EventItem
                {
                    ID = t.ID,
                    Name = t.Name,
                    StartDate = t.StartDate,
                    Segments = t.Segments,
                    OwnerUsername = t.OwnerUsername,
                    OwnerName = t.Owner.FirstName + " " + t.Owner.LastName,
                    EstAttendeeCount = t.EstAttendeeCount,
                    ActAttendeeCount = t.Attendees.Count(),
                    Status = (t.StartDate < deadline) ? "Past" : "Upcoming"
                }).ToList();

            result.Segments = DB.Segments
                .GroupBy(g => g.Name)
                .Select(s => new
                {
                    Segment = s.Key,
                    Count = subquery.Count(t => t.Segments.Contains(s.Key))
                }).ToDictionary(s => s.Segment, s => s.Count);

            var stats = subquery.GroupBy(g => 1).Select(s => new
            {
                Total = s.Count(),
                Past = s.Count(x => x.StartDate <= DateTime.Now),
                Upcoming = s.Count(x => x.StartDate > DateTime.Now)
            }).FirstOrDefault();

            if (stats != null)
            {
                result.Total = stats.Total;
                result.Past = stats.Past;
                result.Upcoming = stats.Upcoming;
            }

            return result;
        }

        public EventInfo SaveEvent(EventInfo eventInfo)
        {
            var evt = this.DB.Tradeshows.Find(eventInfo.ID);

            if (evt == null)
            {
                evt = new Tradeshow();
                evt.CreatedDate = DateTime.UtcNow;
                this.DB.Tradeshows.Add(evt);

                // Add Default Fields
                foreach (var f in DB.DefaultFields.OrderBy(o => o.Order))
                {
                    evt.Fields.Add(new TradeshowField
                    {
                        Label = f.Label,
                        Input = f.Input,
                        Source = f.Source,
                        Tooltip = f.Tooltip,
                        Order = f.Order,
                        Options = f.Options,
                        Required = f.Required,
                        Included = f.Included,
                        Access = f.Access
                    });
                }
            }

            evt.Archived = eventInfo.Archived;
            evt.SendReminders = eventInfo.SendReminders;
            evt.Description = eventInfo.Description;
            evt.EndDate = eventInfo.EndDate;
            evt.EstAttendeeCount = eventInfo.EstAttendCount;
            evt.BureauLink = eventInfo.BureauLink;
            evt.Hotels = eventInfo.Hotels;
            evt.Location = eventInfo.Location;
            evt.Name = eventInfo.Name;
            evt.OwnerUsername = eventInfo.OwnerUsername;
            evt.RosterDueDate = eventInfo.RosterDueDate;
            evt.RsvpDueDate = eventInfo.RsvpDueDate;
            evt.Segments = eventInfo.Segments;
            evt.ShowType = DomainExtensions.ToShowTypeString(eventInfo.ShowType);
            evt.StartDate = eventInfo.StartDate;
            evt.Tier = eventInfo.Tier;
            evt.Venue = eventInfo.Venue;
            evt.LastBcdUpdatedDateTime = eventInfo.LastBcdUpdatedDateTime;
            evt.LastBcdUpdatedUsername = eventInfo.LastBcdUpdatedUsername;

            this.DB.SaveChanges();

            this.SaveEventUsers(evt.ID, eventInfo.Users);

            if (eventInfo.RoomBlocks != null)
            {
                List<DateTime> dates = new List<DateTime>();

                foreach (var rb in eventInfo.RoomBlocks)
                {
                    //var block = DB.TradeshowRoomBlocks
                    //    .Where(b => b.TradeshowID == evt.ID)
                    //    .Where(b => b.Date.Year == rb.Date.Year)
                    //    .Where(b => b.Date.Month == rb.Date.Month)
                    //    .Where(b => b.Date.Day == rb.Date.Day)
                    //    .FirstOrDefault();

                    var block = DB.TradeshowRoomBlocks
                        .Where(b => b.TradeshowID == evt.ID && b.Date.Year == rb.Date.Year && b.Date.Month == rb.Date.Month && b.Date.Day == rb.Date.Day)
                        .FirstOrDefault();

                    if (block == null)
                    {
                        block = new TradeshowRoomBlock();
                        block.TradeshowID = evt.ID;
                        block.Date = rb.Date;
                        DB.TradeshowRoomBlocks.Add(block);
                    }

                    block.EstRoomCount = rb.EstRoomCount;

                    dates.Add(block.Date.Date);
                }

                // Delete orphans
                //foreach (var rb in DB.TradeshowRoomBlocks
                //    .Where(b => !dates.Any(d =>
                //        d.Year == b.Date.Year &&
                //        d.Month == b.Date.Month &&
                //        d.Day == b.Date.Day)))
                //{
                //    DB.TradeshowRoomBlocks.Remove(rb);
                //}

                foreach (var rb in DB.TradeshowRoomBlocks
                    .Where(b => b.TradeshowID == evt.ID && !dates.Any(d =>
                        d.Year == b.Date.Year &&
                        d.Month == b.Date.Month &&
                        d.Day == b.Date.Day)))
                {
                    DB.TradeshowRoomBlocks.Remove(rb);
                }

                this.DB.SaveChanges();
            }

            return GetEvent(evt.ID);
        }
        
        public void DeleteEvent(int eventID)
        {
            var evt = DB.Tradeshows
                .Where(e => e.ID == eventID)
                .FirstOrDefault();

            if (evt == null)
            {
                return;
            }

            // delete room blocks
            foreach (var block in DB.TradeshowRoomBlocks.Where(b => b.TradeshowID == eventID))
            {
                DB.TradeshowRoomBlocks.Remove(block);
            }

            // delete users
            foreach (var user in DB.TradeshowUsers.Where(u => u.TradeshowID == eventID))
            {
                DB.TradeshowUsers.Remove(user);
            }

            // delete event values
            foreach (var value in DB.AttendeeValues.Where(v =>
                        v.TradeshowField.TradeshowID == eventID ||
                        v.Attendee.TradeshowID == eventID))
            {
                DB.AttendeeValues.Remove(value);
            }

            // delete event fields
            foreach (var field in DB.TradeshowFields.Where(f => f.TradeshowID == eventID))
            {
                DB.TradeshowFields.Remove(field);
            }

            // delete attendees
            foreach (var attendee in DB.Attendees.Where(a => a.TradeshowID == eventID))
            {
                DB.Attendees.Remove(attendee);
            }

            // delete event
            DB.Tradeshows.Remove(evt);

            DB.SaveChanges();
        }

        public void SaveEventUsers(int eventID, List<EventUser> users)
        {
            if (users == null)
            {
                return;
            }

            List<string> usersToKeep = new List<string>();

            string owner = null;

            // Add or Update
            foreach (var u in users)
            {
                if (u.User == null)
                {
                    continue;
                }

                string username = u.User.Username.Trim().ToUpper();

                if (u.Role.HasFlag(Role.Lead))
                {
                    owner = username;
                    u.Role &= ~Role.Lead;

                    if (u.Role == Role.None)
                    {
                        continue;
                    }
                }

                var user = this.DB.TradeshowUsers
                    .Where(tu => tu.TradeshowID == eventID)
                    .Where(tu => tu.Username == username)
                    .FirstOrDefault();

                if (user == null)
                {
                    user = new TradeshowUser();
                    user.TradeshowID = eventID;
                    user.Username = username;
                    this.DB.TradeshowUsers.Add(user);
                }

                user.Role = u.Role;

                usersToKeep.Add(username);
            }

            // Remove the remaining
            foreach (var user in this.DB.TradeshowUsers
                .Where(tu => tu.TradeshowID == eventID)
                .Where(tu => !usersToKeep.Contains(tu.Username)))
            {
                this.DB.TradeshowUsers.Remove(user);
            }

            // Update the new owner
            if (!string.IsNullOrWhiteSpace(owner))
            {
                var evt = DB.Tradeshows.Where(t => t.ID == eventID).FirstOrDefault();

                if (evt != null)
                {
                    evt.OwnerUsername = owner;
                }
            }

            this.DB.SaveChanges();
        }
        
        public EventField GetEventField(int fieldID)
        {
            var field = this.DB.TradeshowFields
                .Where(f => f.ID == fieldID)
                .FirstOrDefault();

            if (field == null)
            {
                return null;
            }

            return field.ToEventField();
        }

        public EventField SaveEventField(int eventID, EventField field)
        {
            // Set Order if invalid
            if (field.Order < 1)
            {
                if (field.Access.HasFlag(Role.Attendee))
                {
                    field.Order = DB.TradeshowFields.Count(f =>
                        f.TradeshowID == eventID && f.Access.HasFlag(Role.Attendee)
                        ) + 1;
                }
                else
                {
                    field.Order = DB.TradeshowFields.Count(f =>
                        f.TradeshowID == eventID && !f.Access.HasFlag(Role.Attendee)
                        ) + 1;
                }
            }
            
            var fld = InternalSaveEventField(field, eventID);

            DB.SaveChanges();

            return GetEventField(fld.ID);
        }

        public List<EventField> GetEventFields(int eventID)
        {
            List<EventField> fields = new List<EventField>();

            foreach (var field in this.DB.TradeshowFields
                .Where(f => f.TradeshowID == eventID)
                .OrderByDescending(f => f.Access)
                .ThenBy(f => f.Order)
                .ThenBy(f => f.ID))
            {
                fields.Add(field.ToEventField());
            }

            return fields;
        }

        public void SaveEventFields(int eventID, List<EventField> fields)
        {
            if (fields == null || fields.Count < 1)
            {
                return;
            }

            foreach (var field in fields)
            {
                InternalSaveEventField(field, eventID);
            }

            DB.SaveChanges();
        }

        public void DeleteEventField(int fieldID)
        {
            var field = this.DB.TradeshowFields
                .Include("AttendeeValues")
                .Where(f => f.ID == fieldID)
                .FirstOrDefault();

            if (field == null)
            {
                return;
            }
            else if (!string.IsNullOrWhiteSpace(field.Source))
            {
                throw new Exception("Only custom fields may be deleted.");
            }
            
            int order = field.Order;
            int eventID = field.TradeshowID;
            Role access = field.Access;

            // Remove attendee values first
            DB.AttendeeValues.RemoveRange(field.AttendeeValues);

            DB.TradeshowFields.Remove(field);

            var query = DB.TradeshowFields
                .Where(f => f.TradeshowID == eventID)
                .Where(f => f.Order > order);

            if (access.HasFlag(Role.Attendee))
            {
                query = query.Where(f => f.Access.HasFlag(Role.Attendee));
            }
            else
            {
                query = query.Where(f => !f.Access.HasFlag(Role.Attendee));
            }

            foreach (var f in query.OrderBy(o => o.Order))
            {
                f.Order = order++;
            }

            DB.SaveChanges();
        }
                
        public EventAttendeeQueryResult GetEventAttendees(QueryParams parameters, bool includePassportInfo)
        {
            var query = DB.Attendees
                .Include("User")
                .Include("User.Delegate")
                .Include("FieldValues")
                .Include("FieldValues.TradeshowField")
                .AsQueryable();

            query = query.HandleAttendeeQueryFilters(parameters.Filters);

            var subquery = query;

            // Handle Sorting
            query = query.HandleAttendeeQuerySorts(parameters.Sort);

            var result = new EventAttendeeQueryResult();
            result.Attendees = new List<EventAttendee>();

            foreach (var a in query.Skip(parameters.Skip).Take(parameters.Size))
            {
                result.Attendees.Add(a.ToEventAttendee(includePassportInfo));
            }

            result.Segments = DB.Segments
                .GroupBy(g => g.Name)
                .Select(s => new
                {
                    Segment = s.Key,
                    Count = subquery.Count(a => a.User.Segment == s.Key && (a.DateAccepted.HasValue || a.DateCancelled.HasValue))
                }).ToDictionary(s => s.Segment, s => s.Count);

            var stats = subquery.GroupBy(g => 1).Select(s => new
            {
                Total = s.Count(),
                RSVPD = s.Count(a => a.DateAccepted.HasValue || a.DateCancelled.HasValue),
                Completed = s.Count(a => a.DateCompleted.HasValue),
                Hotel = s.Count(a => a.IsHotelNeeded.Value && !a.DateCancelled.HasValue)
            }).FirstOrDefault();

            if (stats != null)
            {
                result.Total = stats.Total;
                result.RSVPD = stats.RSVPD;
                result.Completed = stats.Completed;
                result.Hotel = stats.Hotel;
            }

            return result;
        }

        public List<EventAttendee> GetEventAttendeesList(QueryParams parameters)
        {
            var query = DB.Attendees
                .Include("User")
                .Include("User.Delegate")
                .Include("FieldValues")
                .Include("FieldValues.TradeshowField")
                .AsQueryable();

            query = query.HandleAttendeeQueryFilters(parameters.Filters);

            // Handle Sorting
            query = query.HandleAttendeeQuerySorts(parameters.Sort);

            query = query.Skip(parameters.Skip);

            if (parameters.Size > 0)
            {
                query = query.Take(parameters.Size);
            }

            var attendees = new List<EventAttendee>();

            foreach (var a in query)
            {
                attendees.Add(a.ToEventAttendee());
            }

            return attendees;
        }
        
        public EventAttendee GetAttendee(int attendeeID)
        {
            var attendee = DB.Attendees
                .Include("User.Delegate")
                .Include("FieldValues")
                .Include("FieldValues.TradeshowField")
                .Where(a => a.ID == attendeeID)
                .FirstOrDefault();

            if (attendee == null)
            {
                return null;
            }

            return attendee.ToEventAttendee();
        }

        public EventAttendee GetAttendee(int eventID, string username)
        {
            var attendee = DB.Attendees
                .Include("User.Delegate")
                .Include("FieldValues")
                .Include("FieldValues.TradeshowField")
                .Where(a => a.TradeshowID == eventID)
                .Where(a => a.Username == username)
                .FirstOrDefault();

            if (attendee == null)
            {
                return null;
            }

            return attendee.ToEventAttendee();
        }

        public EventAttendee SaveAttendee(EventAttendee eventAttendee)
        {
            // Get master event field list
            Dictionary<int, TradeshowField> fields = DB.TradeshowFields
                .Where(f => f.TradeshowID == eventAttendee.EventID)
                .Where(f => f.Included)
                .ToDictionary(f => f.ID, f => f);

            InternalSaveAttendee(eventAttendee, fields);

            DB.SaveChanges();

            return GetAttendee(eventAttendee.EventID, eventAttendee.Username);
        }

        public void SaveAttendees(int eventID, List<EventAttendee> eventAttendees)
        {
            // Get master event field list
            Dictionary<int, TradeshowField> fields = DB.TradeshowFields
                .Where(f => f.TradeshowID == eventID)
                .Where(f => f.Included)
                .ToDictionary(f => f.ID, f => f);

            foreach (var eventAttendee in eventAttendees)
            {
                InternalSaveAttendee(eventAttendee, fields);
            }

            DB.SaveChanges();
        }

        public void DeleteAttendees(int[] ids)
        {
            foreach (int id in ids)
            {
                InternalDeleteAttendee(id);
            }

            DB.SaveChanges();
        }

        #endregion

        #region Attendees
        
        public AttendeeQueryResult GetAttendeeProfiles(QueryParams parameters, string identityUser = null)
        {
            if (parameters.Sort == null || parameters.Sort.Count < 1)
            {
                parameters.Sort = new List<SortParams>();
                parameters.Sort.Add(new SortParams
                {
                    Field = "User.FirstName"
                });
            }

            int index = parameters.Sort.FindIndex(s => s.Field == "User.Name");
            if (index >= 0)
            {
                var sp = new SortParams
                {
                    Field = "User.FirstName",
                    Desc = parameters.Sort[index].Desc
                };
                parameters.Sort[index].Field = "User.LastName";
                parameters.Sort.Insert(index, sp);
            }

            string accepted = AttendeeStatus.Accepted.ToString();
            AttendeeQueryResult result = new AttendeeQueryResult();

            var query = DB.Users.Select(u => new
            {
                User = u,
                Delegate = u.Delegate,
                Attended = u.Attendees.Count(a => a.Status == accepted && a.Tradeshow.StartDate < DateTime.Now)
            });

            if (!string.IsNullOrWhiteSpace(identityUser))
            {
                query = query.Where(u => u.User.Username == identityUser ||
                                         u.User.DelegateUsername == identityUser ||
                                         DB.Attendees.Any(a => a.Username == u.User.Username && (
                                            a.Tradeshow.OwnerUsername == identityUser ||
                                            a.Tradeshow.Users.Any(x => x.Username == identityUser)
                                        )));
            }
            else
            {
                query = query.Where(u => DB.Attendees.Any(a => a.Username == u.User.Username));
            }

            query = query.ToWhereFilter(parameters.Filters);
            var subquery = query;

            query = query.HandleSorts(parameters.Sort);

            // Get the attendees for our page
            foreach (var attendee in query
                .Skip(parameters.Skip)
                .Take(parameters.Size))
            {
                var profile = attendee.User.ToUserProfile(false);
                profile.Delegate = attendee.Delegate.ToUserInfo();
                profile.EventsAttended = attendee.Attended;
                result.Attendees.Add(profile);
            }

            result.Total = subquery.Count();

            return result;
        }
                
        public List<AttendeeEvent> GetAttendeeEvents(string username, string identityUser = null)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            var query = DB.Attendees
                .Include("User")
                .Include("User.Delegate")
                .Include("Tradeshow")
                .Where(a => a.Username == username || a.User.DelegateUsername == username);

            if (!string.IsNullOrWhiteSpace(identityUser))
            {
                query = query.Where(a => a.Username == identityUser ||
                                         a.User.DelegateUsername == identityUser ||
                                         a.Tradeshow.OwnerUsername == identityUser ||
                                         a.Tradeshow.Users.Any(u => u.Username == identityUser));
            }
            
            List<AttendeeEvent> events = new List<AttendeeEvent>();

            foreach (var attendee in query.OrderBy(a => a.Tradeshow.StartDate))
            {
                events.Add(attendee.ToAttendeeEvent());
            }

            return events;
        }

        #endregion

        #region Internal Functions
        
        private TradeshowField InternalSaveEventField(EventField eventField, int eventID)
        {
            if (eventField == null)
            {
                return null;
            }

            var field = DB.TradeshowFields
                .Where(f => f.TradeshowID == eventID)
                .Where(f => f.ID == eventField.ID)
                .FirstOrDefault();

            if (field == null)
            {
                field = new TradeshowField();
                field.TradeshowID = eventID;
                field.Source = eventField.Source;
                field.Access = eventField.Access;

                DB.TradeshowFields.Add(field);
            }

            if (string.IsNullOrWhiteSpace(field.Source))
            {
                field.Input = eventField.Input.ToString();
            }

            field.Label = eventField.Label;
            field.Tooltip = eventField.Tooltip;
            field.Order = eventField.Order;
            field.Options = eventField.Options;
            field.Required = eventField.Required;
            field.Included = eventField.Included;

            return field;
        }

        private void InternalSaveAttendee(EventAttendee eventAttendee, Dictionary<int, TradeshowField> fields)
        {
            var attendee = DB.Attendees
                .Include("User")
                .Include("FieldValues")
                .Where(a => a.TradeshowID == eventAttendee.EventID)
                .Where(a => a.ID == eventAttendee.ID || a.Username == eventAttendee.Username)
                .FirstOrDefault();

            // Check if user delegate exists
            if (eventAttendee.Profile != null && !string.IsNullOrWhiteSpace(eventAttendee.Profile.DelegateUsername))
            {
                var delegateUser = DB.Users.Find(eventAttendee.Profile.DelegateUsername);

                if (delegateUser == null)
                {
                    if (attendee == null)
                    {
                        DB.Users.Add(new User(eventAttendee.Profile.Delegate));
                    }
                    else if (!eventAttendee.Profile.DelegateUsername.Equals(attendee.User.DelegateUsername, StringComparison.CurrentCultureIgnoreCase))
                    {
                        DB.Users.Add(new User(eventAttendee.Profile.Delegate));
                    }
                }
            }

            if (attendee == null)
            {
                attendee = new Attendee();
                attendee.DateCreated = DateTime.Now;
                attendee.TradeshowID = eventAttendee.EventID;
                attendee.Username = eventAttendee.Profile.Username;

                if ((attendee.User = DB.Users
                    .Include("Delegate")
                    .Where(u => u.Username == eventAttendee.Username)
                    .FirstOrDefault()) == null)
                {
                    attendee.User = new User(eventAttendee.Profile);
                }

                DB.Attendees.Add(attendee);
            }

            attendee.Status = eventAttendee.GetStatus().ToString();
            attendee.SendRSVP = eventAttendee.SendRSVP;
            attendee.DateRSVP = eventAttendee.DateRSVP;
            attendee.DateCompleted = eventAttendee.DateCompleted;
            attendee.TravelMethod = eventAttendee.TravelMethod;
            attendee.Arrival = eventAttendee.Arrival;
            attendee.Departure = eventAttendee.Departure;
            attendee.IsHotelNeeded = eventAttendee.IsHotelNeeded.ToBoolean();
            attendee.CCNumber = eventAttendee.CCNumber;
            attendee.CCExpiration = eventAttendee.CCExpiration;
            attendee.CVVNumber = eventAttendee.CVVNumber;

            switch (eventAttendee.GetStatus())
            {
                case AttendeeStatus.Accepted:
                    attendee.DateCancelled = null;
                    attendee.DateAccepted = attendee.DateAccepted.GetValueOrDefault(DateTime.Now);
                    break;
                case AttendeeStatus.Declined:
                    attendee.DateCancelled = attendee.DateCancelled.GetValueOrDefault(DateTime.Now);
                    break;
                default:
                    attendee.DateCancelled = null;
                    attendee.DateAccepted = null;
                    break;
            }

            // Set Profile data
            if (eventAttendee.Profile != null)
            {
                // Set attendee delegate
                if (string.IsNullOrWhiteSpace(eventAttendee.Profile.DelegateUsername))
                {
                    attendee.User.DelegateUsername = null;
                    attendee.User.Delegate = null;
                }
                else
                {
                    attendee.User.DelegateUsername = eventAttendee.Profile.DelegateUsername;
                }

                if (!string.IsNullOrWhiteSpace(eventAttendee.Profile.FirstName))
                {
                    attendee.User.FirstName = eventAttendee.Profile.FirstName;
                }

                if (!string.IsNullOrWhiteSpace(eventAttendee.Profile.LastName))
                {
                    attendee.User.LastName = eventAttendee.Profile.LastName;
                }

                if (!string.IsNullOrWhiteSpace(eventAttendee.Profile.Email))
                {
                    attendee.User.Email = eventAttendee.Profile.Email;
                }

                if (!string.IsNullOrWhiteSpace(eventAttendee.Profile.EmplID))
                {
                    attendee.User.EmplID = eventAttendee.Profile.EmplID;
                }

                if (!string.IsNullOrWhiteSpace(eventAttendee.Profile.Title))
                {
                    attendee.User.Title = eventAttendee.Profile.Title;
                }

                if (!string.IsNullOrWhiteSpace(eventAttendee.Profile.Segment))
                {
                    attendee.User.Segment = eventAttendee.Profile.Segment;
                }

                if (eventAttendee.Profile.Telephone != null)
                {
                    attendee.User.Telephone = eventAttendee.Profile.Telephone;
                }

                if (eventAttendee.Profile.Mobile != null)
                {
                    attendee.User.Mobile = eventAttendee.Profile.Mobile;
                }

                if (eventAttendee.Profile.BadgeName != null)
                {
                    attendee.User.BadgeName = eventAttendee.Profile.BadgeName.Trim();
                }

                // SET PROFILE PASSPORT DATA

                if (eventAttendee.Profile.PassportName != null)
                {
                    attendee.User.PassportName = eventAttendee.Profile.PassportName.Trim();
                }

                if (eventAttendee.Profile.PassportNumber != null)
                {
                    attendee.User.PassportNumber = eventAttendee.Profile.PassportNumber.Trim();
                }

                if (eventAttendee.Profile.PassportExpirationDate != null)
                {
                    attendee.User.PassportExpirationDate = eventAttendee.Profile.PassportExpirationDate.ToDTOFormat();
                }

                if (eventAttendee.Profile.Nationality != null)
                {
                    attendee.User.Nationality = eventAttendee.Profile.Nationality.Trim();
                }

                if (eventAttendee.Profile.DOB.HasValue)
                {
                    attendee.User.DOB = eventAttendee.Profile.DOB.ToDTOFormat();
                }

                if (eventAttendee.Profile.COB != null)
                {
                    attendee.User.COB = eventAttendee.Profile.COB.Trim();
                }

                if (eventAttendee.Profile.COR != null)
                {
                    attendee.User.COR = eventAttendee.Profile.COR.Trim();
                }

                if (eventAttendee.Profile.COI != null)
                {
                    attendee.User.COI = eventAttendee.Profile.COI.Trim();
                }
            }

            if (eventAttendee.Properties != null)
            {
                foreach (var prop in attendee.FieldValues)
                {
                    if (eventAttendee.Properties.ContainsKey(prop.TradeshowFieldID))
                    {
                        prop.Value = eventAttendee.Properties[prop.TradeshowFieldID] ?? string.Empty;
                        eventAttendee.Properties.Remove(prop.TradeshowFieldID);
                    }
                }

                foreach (var id in eventAttendee.Properties.Keys)
                {
                    if (fields.ContainsKey(id))
                    {
                        string propName = fields[id].Source;

                        if (string.IsNullOrWhiteSpace(propName))
                        {
                            AttendeeValue av = new AttendeeValue();
                            av.TradeshowFieldID = id;
                            av.Value = eventAttendee.Properties[id] ?? string.Empty;
                            av.Attendee = attendee;
                            DB.AttendeeValues.Add(av);
                        }
                        else
                        {
                            var srcProp = typeof(EventAttendee).GetProperty(propName);
                            var tgtProp = typeof(Attendee).GetProperty(propName);

                            if (srcProp != null && tgtProp != null)
                            {
                                tgtProp.SetValue(attendee, srcProp.GetValue(eventAttendee));
                            }
                        }
                    }
                }
            }
        }

        private void InternalDeleteAttendee(int attendeeID)
        {
            var attendee = DB.Attendees
                .Include("FieldValues")
                .Where(a => a.ID == attendeeID)
                .FirstOrDefault();

            if (attendee != null)
            {
                // Delete attendee values
                DB.AttendeeValues.RemoveRange(attendee.FieldValues);
                DB.Attendees.Remove(attendee);
            }
        }

        #endregion
    }
}
