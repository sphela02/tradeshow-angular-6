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
}