using System.Web.Http;

namespace TradeshowTravel.Web.Controllers
{
    [Authorize]
    [EnableCors]
    public class SegmentController : BaseController
    {
        [Route("~/api/segments")]
        public IHttpActionResult Get()
        {
            return Ok(Service.GetSegments());
        }
    }
}
