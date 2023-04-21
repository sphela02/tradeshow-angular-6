using System.Web.Http;

namespace TradeshowTravel.Web.Controllers
{
    using Data;
    using Domain;
    using ECA;

    public class BaseController : ApiController
    {
        protected NLog.ILogger theLogger { get; }
        protected TradeshowSrv Service { get; set; }

        public BaseController()
        {
            theLogger = NLog.LogManager.GetCurrentClassLogger();

            Service = new TradeshowSrv(new TSDataRepository(), new ECAUserRepository());
        }
    }
}
