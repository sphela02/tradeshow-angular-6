using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace TradeshowTravel.Data
{
    using Domain;
    using Domain.DTOs;
    using Models;

    public static class ExtensionHelpers
    {

        public static UserProfile ToUserProfile(this User user, bool includePassportInfo = true)
        {
            if (user == null)
            {
                return null;
            }

            UserProfile profile = new UserProfile()
            {
                Username = user.Username,
                DelegateUsername = user.DelegateUsername,
                EmplID = user.EmplID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Segment = user.Segment,
                Title = user.Title,
                Mobile = user.Mobile,
                Telephone = user.Telephone,
                BadgeName = user.BadgeName,
                PassportNumber = (includePassportInfo) ? user.PassportNumber : null,
                PassportName = (includePassportInfo) ? user.PassportName : null,
                PassportExpirationDate = (includePassportInfo) ? user.PassportExpirationDate.ToDateTime() : null,
                DOB = (includePassportInfo) ? user.DOB.ToDateTime() : null,
                Nationality = (includePassportInfo) ? user.Nationality : null,
                COB = (includePassportInfo) ? user.COB : null,
                COR = (includePassportInfo) ? user.COR : null,
                COI = (includePassportInfo) ? user.COI : null,
                Privileges = user.Privileges,
                Role = Role.Attendee,
                ShowPicture = !string.IsNullOrWhiteSpace(user.EmplID),
                Visa = user.Visa.ToYesNoString()
            };

            if (user.Delegate != null)
            {
                profile.Delegate = user.Delegate.ToUserInfo();
            }

            return profile;
        }

        public static UserInfo ToUserInfo(this User user)
        {
            if (user == null)
            {
                return null;
            }

            return new UserInfo()
            {
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Segment = user.Segment,
                Email = user.Email
            };
        }
        
        public static EventInfo ToEventInfo(this Tradeshow show)
        {
            if (show == null)
            {
                return null;
            }

            EventInfo evt = new EventInfo()
            {
                ID = show.ID,
                Name = show.Name,
                Description = show.Description,
                Venue = show.Venue,
                Location = show.Location,
                StartDate = show.StartDate,
                EndDate = show.EndDate,
                Segments = show.Segments,
                Tier = show.Tier,
                ShowType = show.ShowType.ToShowType(),
                RosterDueDate = show.RosterDueDate,
                RsvpDueDate = show.RsvpDueDate,
                BureauLink = show.BureauLink,
                Hotels = show.Hotels,
                EstAttendCount = show.EstAttendeeCount,
                OwnerUsername = show.OwnerUsername,
                CreatedDate = show.CreatedDate,
                SendReminders = show.SendReminders,
                Archived = show.Archived,
                LastBcdUpdatedUsername = show.LastBcdUpdatedUsername,
                LastBcdUpdatedDateTime = show.LastBcdUpdatedDateTime
            };

            if (show.Owner != null)
            {
                evt.Owner = show.Owner.ToUserInfo();
            }

            if (show.LastBcdUpdated != null)
            {
                evt.LastBcdUpdated = show.LastBcdUpdated.ToUserInfo();
            }

            if (show.Users != null && show.Users.Count > 0)
            {
                evt.Users = show.Users.Select(u => new EventUser
                {
                    Role = u.Role,
                    User = u.User.ToUserInfo()
                }).ToList();
            }

            if (show.Fields != null && show.Fields.Count > 0)
            {
                evt.Fields = new List<EventField>();

                foreach (var f in show.Fields
                    .OrderByDescending(o => o.Access)
                    .ThenBy(o => o.Order))
                {
                    evt.Fields.Add(f.ToEventField());
                }
            }

            if (show.RoomBlocks != null && show.RoomBlocks.Count > 0)
            {
                evt.RoomBlocks = new List<EventRoomBlock>();

                foreach (var b in show.RoomBlocks.OrderBy(o => o.Date))
                {
                    evt.RoomBlocks.Add(new EventRoomBlock
                    {
                        Date = b.Date,
                        EstRoomCount = b.EstRoomCount
                    });
                }
            }

            return evt;
        }

        public static EventField ToEventField(this TradeshowField field)
        {
            if (field == null)
            {
                return null;
            }

            EventField ef = new EventField
            {
                ID = field.ID,
                Label = field.Label,
                Input = field.Input.ToInputType(),
                Source = field.Source,
                Tooltip = field.Tooltip,
                Options = field.Options,
                Order = field.Order,
                Required = field.Required,
                Included = field.Included,
                Access = field.Access
            };

            return ef;
        }

        public static EventAttendee ToEventAttendee(this Attendee attendee, bool includePassportInfo = true)
        {
            if (attendee == null)
            {
                return null;
            }

            EventAttendee ea = new EventAttendee
            {
                ID = attendee.ID,
                EventID = attendee.TradeshowID,
                Username = attendee.Username,
                Status = attendee.Status.ToAttendeeStatus(),
                SendRSVP = attendee.SendRSVP,
                DateCreated = attendee.DateCreated,
                DateRSVP = attendee.DateRSVP,
                DateCompleted = attendee.DateCompleted,
                Profile = attendee.User.ToUserProfile(includePassportInfo),
                TravelMethod = attendee.TravelMethod,
                Arrival = attendee.Arrival,
                Departure = attendee.Departure,
                CCNumber = attendee.CCNumber,
                CCExpiration = attendee.CCExpiration,
                CVVNumber = attendee.CVVNumber,
                IsAttending = attendee.IsAttending.ToYesNoString(),
                IsHotelNeeded = attendee.IsHotelNeeded.ToYesNoString(),
                Properties = attendee.FieldValues
                    .Where(v => v.TradeshowField.Included)
                    .ToDictionary(k => k.TradeshowFieldID, v => v.Value)
            };
            
            return ea;
        }

        public static AttendeeEvent ToAttendeeEvent(this Attendee attendee)
        {
            if (attendee == null)
            {
                return null;
            }

            var evt = new AttendeeEvent
            {
                ID = attendee.ID,
                Name = attendee.User.FirstName + " " + attendee.User.LastName,
                Username = attendee.Username,
                EventID = attendee.TradeshowID,
                EventName = attendee.Tradeshow.Name,
                StartDate = attendee.Tradeshow.StartDate,
                EndDate = attendee.Tradeshow.EndDate,
                Status = attendee.Status.ToAttendeeStatus(),
                IsComplete = attendee.DateCompleted.HasValue
            };

            if (attendee.User.Delegate != null)
            {
                evt.DelegateUsername = attendee.User.DelegateUsername;
                evt.DelegateName = attendee.User.Delegate.FirstName + " " + attendee.User.Delegate.LastName;
            }

            // Check required profile fields
            //foreach (var propname in UserProfile.EVENT_PROFILE_REQ_FIELDS)
            //{
            //    evt.QuestionsCount++;

            //    if (attendee.User.IsCompleted(propname))
            //    {
            //        evt.AnswersCount++;
            //    }
            //}

            //if (attendee.Tradeshow.ShowType.ToShowType() == ShowType.International)
            //{
            //    // Check required passport fields
            //    foreach (var propname in UserProfile.PASSPORT_REQ_FIELDS)
            //    {
            //        evt.QuestionsCount++;

            //        if (attendee.User.IsCompleted(propname))
            //        {
            //            evt.AnswersCount++;
            //        }
            //    }
            //}

            // Check required attendee fields
            //foreach (var field in attendee.Tradeshow.Fields
            //            .Where(f => f.Access.HasFlag(Role.Attendee))
            //            .Where(f => f.Included)
            //            .Where(f => f.Required))
            //{
            //    evt.QuestionsCount++;

            //    if (string.IsNullOrWhiteSpace(field.Source))
            //    {
            //        if (attendee.FieldValues.Any(v =>
            //                v.TradeshowFieldID == field.ID &&
            //                !string.IsNullOrWhiteSpace(v.Value)))
            //        {
            //            evt.AnswersCount++;
            //        }
            //    }
            //    else if (attendee.IsCompleted(field.Source))
            //    {
            //        evt.AnswersCount++;
            //    }
            //}

            return evt;
        }

        public static IQueryable<T> ToWhereFilter<T>(this IQueryable<T> query, List<FilterParams> filters)
        {
            if (filters == null || filters.Count < 1)
            {
                return query;
            }

            ParameterExpression param = Expression.Parameter(typeof(T));

            Dictionary<string, List<FilterParams>> uniquefilters = new Dictionary<string, List<FilterParams>>();

            foreach (var filter in filters)
            {
                if (string.IsNullOrWhiteSpace(filter.Operator))
                {
                    continue;
                }

                filter.Operator = filter.Operator.ToLower();

                // check for null or notnull synonyms
                if (filter.Value == null)
                {
                    switch (filter.Operator)
                    {
                        case "eq":
                            filter.Operator = "isnull";
                            break;
                        case "neq":
                            filter.Operator = "isnotnull";
                            break;
                    }
                }

                string key = filter.Field + filter.Operator;

                if (uniquefilters.ContainsKey(key))
                {
                    uniquefilters[key].Add(filter);
                }
                else
                {
                    uniquefilters[key] = new List<FilterParams>() { filter };
                }
            }

            foreach (string key in uniquefilters.Keys)
            {
                Expression expr = null;

                foreach (var filter in uniquefilters[key])
                {
                    if (expr == null)
                    {
                        expr = filter.ToFilterExpr(param);
                    }
                    else
                    {
                        expr = Expression.Or(expr, filter.ToFilterExpr(param));
                    }
                }

                if (expr != null)
                {
                    query = query.Where(Expression.Lambda<Func<T, bool>>(expr, param));
                }
            }

            return query;
        }

        private static LambdaExpression ToLambdaExpression(this Type type, string propertyName)
        {
            var param = Expression.Parameter(type, string.Empty);
            Expression body = param;
            foreach (var member in propertyName.Split('.'))
            {
                body = Expression.PropertyOrField(body, member);
            }
            return Expression.Lambda(body, param);
        }
        
        #region EF Ordering Helpers

        private static IOrderedQueryable<T> OrderingHelper<T>(IQueryable<T> source, string propertyName, bool descending, bool anotherLevel)
        {
            LambdaExpression sort = typeof(T).ToLambdaExpression(propertyName);
            
            MethodCallExpression call = Expression.Call(
                typeof(Queryable),
                (!anotherLevel ? "OrderBy" : "ThenBy") + (descending ? "Descending" : string.Empty),
                new[] { typeof(T), sort.ReturnType },
                source.Expression,
                Expression.Quote(sort));
            return (IOrderedQueryable<T>)source.Provider.CreateQuery<T>(call);
        }

        public static IOrderedQueryable<T> OrderBy<T>(this IQueryable<T> source, string propertyName)
        {
            return OrderingHelper(source, propertyName, false, false);
        }
        public static IOrderedQueryable<T> OrderByDescending<T>(this IQueryable<T> source, string propertyName)
        {
            return OrderingHelper(source, propertyName, true, false);
        }
        public static IOrderedQueryable<T> ThenBy<T>(this IOrderedQueryable<T> source, string propertyName)
        {
            return OrderingHelper(source, propertyName, false, true);
        }
        public static IOrderedQueryable<T> ThenByDescending<T>(this IOrderedQueryable<T> source, string propertyName)
        {
            return OrderingHelper(source, propertyName, true, true);
        }

        public static IOrderedQueryable<Tradeshow> HandleEventQuerySorts(this IQueryable<Tradeshow> query, List<SortParams> sorts)
        {
            if (sorts == null || sorts.Count < 1)
            {
                return query.OrderBy("StartDate");
            }
            
            IOrderedQueryable<Tradeshow> order = null;

            foreach (var sort in sorts)
            {
                switch (sort.Field)
                {
                    case "OwnerName":
                    {
                        if (order == null)
                        {
                            order = (sort.Desc) ? query.OrderByDescending(t => t.Owner.FirstName) : query.OrderBy(t => t.Owner.FirstName);
                        }
                        else
                        {
                            order = (sort.Desc) ? order.ThenByDescending(t => t.Owner.FirstName) : order.ThenBy(t => t.Owner.FirstName);
                        }

                        // Last Name
                        order = (sort.Desc) ? order.ThenByDescending(t => t.Owner.LastName) : order.ThenBy(t => t.Owner.LastName);

                        break;
                    }
                    case "Status":
                    {
                        if (order == null)
                        {
                            order = (sort.Desc) ? query.OrderByDescending(t => t.StartDate <= DateTime.Now ? "Completed" : "Upcoming") : query.OrderBy(t => t.StartDate <= DateTime.Now ? "Completed" : "Upcoming");
                        }
                        else
                        {
                            order = (sort.Desc) ? order.ThenByDescending(t => t.StartDate <= DateTime.Now ? "Completed" : "Upcoming") : order.ThenBy(t => t.StartDate <= DateTime.Now ? "Completed" : "Upcoming");
                        }
                        break;
                    }
                    case "ActAttendeeCount":
                    {
                        if (order == null)
                        {
                            order = (sort.Desc) ? query.OrderByDescending(t => t.Attendees.Count()) : query.OrderBy(t => t.Attendees.Count());
                        }
                        else
                        {
                            order = (sort.Desc) ? order.ThenByDescending(t => t.Attendees.Count()) : order.ThenBy(t => t.Attendees.Count());
                        }

                        break;
                    }
                    default:
                    {
                        if (order == null)
                        {
                            order = OrderingHelper(query, sort.Field, sort.Desc, false);
                        }
                        else
                        {
                            order = OrderingHelper(order, sort.Field, sort.Desc, true);
                        }
                        break;
                    }
                }
            }

            return order;
        }

        public static IOrderedQueryable<T> HandleSorts<T>(this IQueryable<T> query, List<SortParams> sorts)
        {
            IOrderedQueryable<T> order = null;

            foreach (var sort in sorts)
            {
                if (order == null)
                {
                    order = OrderingHelper(query, sort.Field, sort.Desc, false);
                }
                else
                {
                    order = OrderingHelper(order, sort.Field, sort.Desc, true);
                }
            }

            return order;
        }

        public static IOrderedQueryable<Attendee> HandleAttendeeQuerySorts(
            this IQueryable<Attendee> query,
            List<SortParams> sorts)
        {
            if (sorts == null || sorts.Count < 1)
            {
                sorts = new List<SortParams>();
                sorts.Add(new SortParams { Field = "Name", Desc = false });
            }

            IOrderedQueryable<Attendee> order = null;

            foreach (var sort in sorts)
            {
                switch (sort.Field)
                {
                    case "Name":
                    {
                        if (order == null)
                        {
                            order = OrderingHelper(query, "User.FirstName", sort.Desc, false);
                        }
                        else
                        {
                            order = OrderingHelper(order, "User.FirstName", sort.Desc, true);
                        }

                        // Last Name
                        order = OrderingHelper(order, "User.LastName", sort.Desc, true);

                        break;
                    }
                    case "RSVPResponse":
                    {
                        if (order == null)
                        {
                            order = (sort.Desc) ? query.OrderByDescending(a => a.DateCancelled.HasValue ? "No" : a.DateAccepted.HasValue ? "Yes" : null) : query.OrderBy(a => a.DateCancelled.HasValue ? "No" : a.DateAccepted.HasValue ? "Yes" : null);
                        }
                        else
                        {
                            order = (sort.Desc) ? order.OrderByDescending(a => a.DateCancelled.HasValue ? "No" : a.DateAccepted.HasValue ? "Yes" : null) : query.OrderBy(a => a.DateCancelled.HasValue ? "No" : a.DateAccepted.HasValue ? "Yes" : null);
                        }

                        break;
                    }
                    default:
                    {
                        if (order == null)
                        {
                            order = OrderingHelper(query, sort.Field, sort.Desc, false);
                        }
                        else
                        {
                            order = OrderingHelper(order, sort.Field, sort.Desc, true);
                        }
                        break;
                    }
                }
            }

            return order;
        }

        #endregion

        #region EF Filter Helpers
        
        private static Expression ToFilterExpr(this FilterParams filter, ParameterExpression param)
        {
            MemberExpression member = null;

            foreach (var name in filter.Field.Split('.'))
            {
                if (member == null)
                {
                    member = Expression.PropertyOrField(param, name);
                }
                else
                {
                    member = Expression.PropertyOrField(member, name);
                }
            }

            Expression valexpr = Expression.Constant(filter.Value);

            if (member.Type == typeof(DateTime))
            {
                valexpr = Expression.Constant(DateTime.Parse(filter.Value), member.Type);
            }

            if (member.Type == typeof(DateTime?))
            {
                valexpr = Expression.Constant(filter.Value.ToDateTime(), member.Type);
            }

            if (member.Type == typeof(bool))
            {
                valexpr = Expression.Constant(filter.Value.ToBool(), member.Type);
            }

            if (member.Type == typeof(bool?))
            {
                if(filter.Value == null || filter.Value == "null")
                {
                    valexpr = Expression.Constant(null, member.Type);
                }
                else
                {
                    valexpr = Expression.Constant(filter.Value.ToBool(), member.Type);
                }
            }

            if (member.Type == typeof(int))
            {
                valexpr = Expression.Constant(int.Parse(filter.Value), member.Type);
            }
            
            Expression expr = null;

            switch (filter.Operator.Trim().ToUpper())
            {
                case "ISNULL":
                {
                    expr = Expression.Equal(member, valexpr);
                    break;
                }
                case "ISNOTNULL":
                {
                    expr = Expression.NotEqual(member, valexpr);
                    break;
                }
                case "EQ":
                {
                    expr = Expression.Equal(member, valexpr);
                    break;
                }
                case "NEQ":
                {
                    expr = Expression.NotEqual(member, valexpr);
                    break;
                }
                case "GT":
                {
                    expr = Expression.GreaterThan(member, valexpr);
                    break;
                }
                case "GTE":
                {
                    expr = Expression.GreaterThanOrEqual(member, valexpr);
                    break;
                }
                case "LT":
                {
                    expr = Expression.LessThan(member, valexpr);
                    break;
                }
                case "LTE":
                {
                    expr = Expression.LessThanOrEqual(member, valexpr);
                    break;
                }
                case "CONTAINS":
                {
                    expr = Expression.Call(member, member.Type.GetMethod("Contains"), valexpr);
                    break;
                }
                case "DOESNOTCONTAIN":
                {
                    expr = Expression.Not(Expression.Call(member, member.Type.GetMethod("Contains"), valexpr));
                    break;
                }
                case "STARTSWITH":
                {
                    expr = Expression.Call(member, member.Type.GetMethod("StartsWith", new Type[] { member.Type }), valexpr);
                    break;
                }
                case "ENDSWITH":
                {
                    expr = Expression.Call(member, member.Type.GetMethod("EndsWith", new Type[] { member.Type }), valexpr);
                    break;
                }
            }

            return expr;
        }

        public static IQueryable<Attendee> HandleAttendeeQueryFilters(this IQueryable<Attendee> query, List<FilterParams> filters)
        {
            const string NO_VALUE = "NoValue";

            if (filters == null || filters.Count < 1)
            {
                return query;
            }

            ParameterExpression param = Expression.Parameter(typeof(Attendee));

            Dictionary<string, List<FilterParams>> uniquefilters = new Dictionary<string, List<FilterParams>>();

            foreach (var filter in filters)
            {
                if (string.IsNullOrWhiteSpace(filter.Operator))
                {
                    continue;
                }

                filter.Operator = filter.Operator.ToLower();

                // set key before changeing operator, this will ensure filters with the same key are OR together regarles if it is 'eq' or 'isnull'
                // otherwise it will use an AND operator between them
                string key = filter.Field + filter.Operator;

                // check for null or notnull synonyms
                if (filter.Value == null || filter.Value == NO_VALUE)
                {
                    switch (filter.Operator)
                    {
                        case "eq":
                            filter.Operator = "isnull";
                            break;
                        case "neq":
                            filter.Operator = "isnotnull";
                            break;
                    }
                }

                if (uniquefilters.ContainsKey(key))
                {
                    uniquefilters[key].Add(filter);
                }
                else
                {
                    if(filter.Field == "User.Name")
                    {
                        var filter1 = new FilterParams()
                        {
                            Field = "User.FirstName",
                            Operator = filter.Operator,
                            Value = filter.Value
                        };
                        var filter2 = new FilterParams()
                        {
                            Field = "User.LastName",
                            Operator = filter.Operator,
                            Value = filter.Value
                        };
                        uniquefilters[key] = new List<FilterParams>() { filter1, filter2 };
                    }
                    else
                    {
                        uniquefilters[key] = new List<FilterParams>() { filter };
                    }
                }
            }

            foreach (string key in uniquefilters.Keys)
            {
                Expression expr = null;

                foreach (var filter in uniquefilters[key])
                {
                    if (expr == null)
                    {
                        expr = filter.ToFilterExpr(param);
                    }
                    else
                    {
                        expr = Expression.Or(expr, filter.ToFilterExpr(param));
                    }
                }
                
                if (expr != null)
                {
                    query = query.Where(Expression.Lambda<Func<Attendee, bool>>(expr, param));
                }
            }

            return query;
        }

        public static IQueryable<Tradeshow> HandleEventQueryFilters(this IQueryable<Tradeshow> query, List<FilterParams> filters)
        {
            if (query == null || filters == null || filters.Count < 1)
            {
                return query;
            }

            Dictionary<string, List<FilterParams>> orfilters = new Dictionary<string, List<FilterParams>>();

            ParameterExpression param = Expression.Parameter(typeof(Tradeshow));

            foreach (var filter in filters)
            {
                if (string.IsNullOrWhiteSpace(filter.Operator))
                {
                    continue;
                }

                if (filter.Operator.Equals("contains", StringComparison.CurrentCultureIgnoreCase))
                {
                    if (orfilters.ContainsKey(filter.Field))
                    {
                        orfilters[filter.Field].Add(filter);
                    }
                    else
                    {
                        orfilters[filter.Field] = new List<FilterParams>() { filter };
                    }

                    continue;
                }

                Expression expr = filter.ToFilterExpr(param);

                if (expr == null)
                {
                    continue;
                }

                query = query.Where(Expression.Lambda<Func<Tradeshow, bool>>(expr, param));
            }

            foreach (string key in orfilters.Keys)
            {
                Expression orexpr = null;

                foreach (var filter in orfilters[key])
                {
                    if (orexpr == null)
                    {
                        orexpr = filter.ToFilterExpr(param);
                    }
                    else
                    {
                        orexpr = Expression.Or(orexpr, filter.ToFilterExpr(param));
                    }
                }

                query = query.Where(Expression.Lambda<Func<Tradeshow, bool>>(orexpr, param));
            }

            return query;
        }

        #endregion
    }
}
