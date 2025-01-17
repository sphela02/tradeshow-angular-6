﻿using System.Collections.Generic;
using System.Net;
using System.Web.Http;

using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Web;
using TradeshowTravel.Data;
using TradeshowTravel.Domain;
using TradeshowTravel.Domain.DTOs;
using TradeshowTravel.ECA;

namespace TradeshowTravel.Web.Download.Controllers
{
    [Authorize]
    [HideFromBcd]
    [EnableCors]
    public class HomeController : ApiController
    {
        private TradeshowSrv Service;

        public HomeController()
        {
            Service = new TradeshowSrv(new TSDataRepository(), new ECAUserRepository());
        }

        [HttpGet]
        [HideFromBlackList]
        [Route("~/api/showPi/{eventId}")]
        public IHttpActionResult Index()
        {
            return Ok(true);
        }

        [HttpGet]
        [HttpPost]
        [Route("~/api/attendees")]
        public IHttpActionResult GetAttendees(QueryParams parameters)
        {
            ValidationResponse<AttendeeQueryResult> response = Service.GetAttendees(parameters ?? new QueryParams());

            return response.Success
                ? (IHttpActionResult) Ok(response.Result)
                : HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
        }

        [HttpPost]
        [Route("~/api/TravelDocs/download/{eventId}")]
        public IHttpActionResult DownloadAttendeeDocuments([FromBody] int[] ids)
        {
            ValidationResponse<byte[]> response = Service.GetAttendeeDocuments(ids);

            return !response.Success
                ? (IHttpActionResult)HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message)
                : ResponseMessage(new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(response.Result)
                    {
                        Headers =
                        {
                            ContentDisposition = new ContentDispositionHeaderValue(DispositionTypeNames.Attachment),
                            ContentType = new MediaTypeHeaderValue(MediaTypeNames.Application.Octet)
                        }
                    }
                });
        }

        [HttpGet]
        [HttpPost]
        [Route("~/api/TravelDocs/{username}")]
        public IHttpActionResult GetTravelDocs(string username)
        {
            ValidationResponse<List<UserImages>> response = Service.GetTravelDocs(username.ToUpper());

            return response.Success
                ? (IHttpActionResult) Ok(response.Result)
                : HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
        }

        [HttpPost]
        [Route("~/api/TravelDocs/Save/{username}/{category}/{description}")]
        public IHttpActionResult SaveTravelDocs(string username, string category, string description)
        {
            var file = HttpContext.Current.Request.Files.Count > 0 ? HttpContext.Current.Request.Files[0] : null;

            ValidationResponse<bool> response = Service.SaveImage(username.ToUpper(), file, category.ToUpper(), description);

            return response.Success
                ? HttpResult.Create(Request, HttpStatusCode.NoContent)
                : HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
        }

        [HttpPost]
        [HttpDelete]
        [Route("~/api/TravelDocs/Delete/{username}")]
        public IHttpActionResult DeleteImage(string username, [FromBody] List<string> categories)
        {
            ValidationResponse<bool> response = Service.DeleteImages(username, categories);

            return response.Success
                ? (IHttpActionResult)Ok(true)
                : HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
        }

        [HttpGet]
        [HttpPost]
        [Route("~/api/events/{eventID}/attendees")]
        public IHttpActionResult GetAttendees(int eventID, QueryParams parameters)
        {
            ValidationResponse<EventAttendeeQueryResult> response = Service.GetEventAttendees(eventID, true, parameters);

            return response.Success
                ? (IHttpActionResult)Ok(response.Result)
                : HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
        }

        [Route("~/api/attendees/{attendeeID}")]
        public IHttpActionResult GetAttendee(int eventID, int attendeeID)
        {
            ValidationResponse<EventAttendee> response = Service.GetEventAttendee(attendeeID, true);

            return response.Success
                ? (IHttpActionResult)Ok(response.Result)
                : HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
        }
    }
}
