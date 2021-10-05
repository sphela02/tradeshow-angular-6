using System.Configuration;
using System.DirectoryServices.AccountManagement;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using TradeshowTravel.Data;
using TradeshowTravel.Domain;
using TradeshowTravel.Domain.DTOs;
using TradeshowTravel.ECA;

namespace TradeshowTravel.Web.Download
{
    public class HideFromBcdAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var service = new TradeshowSrv(new TSDataRepository(), new ECAUserRepository());

            if (actionContext.RequestContext.RouteData.Values.ContainsKey("username"))
            {
                var username = actionContext.RequestContext.RouteData.Values["username"] as string;

                if (!string.IsNullOrWhiteSpace(username))
                {
                    if (service.CurrentUsername.Equals(username, System.StringComparison.OrdinalIgnoreCase))
                    {
                        return;
                    }

                    if (service.CurrentUserHasRoleForAttendee(username, Role.Support))
                    {
                        return;
                    }
                }
            }

            object eventRouteData;
            int eventId;

            Role currentUserRole =
                actionContext.RequestContext.RouteData.Values.TryGetValue("eventId", out eventRouteData) &&
                int.TryParse(eventRouteData as string, out eventId)
                    ? service.GetCurrentUserRole(eventId)
                    : service.GetCurrentUserRole();

            if (currentUserRole <= Role.Travel)
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
            }
        }
    }

    public class HideFromBlackListAttribute : AuthorizationFilterAttribute
    {
        private static string[] PIBlackList
        {
            get
            {
                var str = ConfigurationManager.AppSettings["PIBlackList"];
                
                if (string.IsNullOrWhiteSpace(str))
                {
                    return new string[0];
                }

                return str.Trim().Split(new char[] { ',', ';', '|' });
            }
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var service = new TradeshowSrv(new TSDataRepository(), new ECAUserRepository());

            if (string.IsNullOrWhiteSpace(service.CurrentUsername))
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
                return;
            }

            PrincipalContext principalContext = null;
            UserPrincipal currentUser = null;

            foreach (var item in PIBlackList)
            {
                var tokens = item.Split(new char[] { '\\' }, 2);

                if (tokens.Length <= 1)
                {
                    continue;
                }

                if (service.CurrentUsername.Equals(tokens[1], System.StringComparison.OrdinalIgnoreCase))
                {
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
                    return;
                }

                if (principalContext == null || !principalContext.Name.Equals(tokens[0].Trim().ToUpper()))
                {
                    principalContext = new PrincipalContext(ContextType.Domain, tokens[0].Trim().ToUpper());
                    currentUser = UserPrincipal.FindByIdentity(principalContext, service.CurrentUsername);
                }

                if (currentUser != null)
                {
                    var group = GroupPrincipal.FindByIdentity(principalContext, tokens[1].Trim().ToUpper());

                    if (group != null)
                    {
                        if (currentUser.IsMemberOf(group))
                        {
                            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
                            return;
                        }
                    }
                }
            }
        }
    }
}