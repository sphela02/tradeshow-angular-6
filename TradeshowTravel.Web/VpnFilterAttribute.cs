using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace TradeshowTravel.Web
{
    public class VpnFilterAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            bool isVpn;

            if(!bool.TryParse(ConfigurationManager.AppSettings["IsVpn"], out isVpn) || isVpn)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Forbidden);
            }

            return base.IsAuthorized(actionContext);
        }
    }
}