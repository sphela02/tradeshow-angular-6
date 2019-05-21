using System.Collections.Generic;
using System.Net;
using System.Web.Http;

namespace TradeshowTravel.Web.Controllers
{
    using Domain.DTOs;

    [Authorize]
    [EnableCors]
    public class AttendeeController : BaseController
    {
        [HttpGet]
        [HttpPost]
        [Route("~/api/attendees")]
        public IHttpActionResult GetAttendees(QueryParams parameters)
        {
            if (parameters == null)
            {
                parameters = new QueryParams();
            }

            ValidationResponse<AttendeeQueryResult> response = Service.GetAttendees(parameters);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }
        
        [Route("~/api/attendees/{attendeeID}")]
        public IHttpActionResult Get(int attendeeID)
        {
            ValidationResponse<EventAttendee> response = Service.GetEventAttendee(attendeeID);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }
        
        [Route("~/api/attendees/{username}/events")]
        public IHttpActionResult GetAttendeeEvents(string username)
        {
            ValidationResponse<List<AttendeeEvent>> response = Service.GetAttendeeEvents(username);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }
    }
}
