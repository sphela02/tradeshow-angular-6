using System.Web.Http;

namespace TradeshowTravel.Web.Controllers
{
    using Data;
    using Domain;
    using ECA;

    public class BaseController : ApiController
    {
        protected TradeshowSrv Service { get; set; }

        public BaseController()
        {
            Service = new TradeshowSrv(new TSDataRepository(), new ECAUserRepository());
        }
    }
}
