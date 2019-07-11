using System.Collections.Generic;
using System.Net;
using System.Web.Http;

namespace TradeshowTravel.Web.Controllers
{
    using Domain.DTOs;
    using Telerik.Windows.Documents.Spreadsheet.Model;
    using Telerik.Windows.Documents.Spreadsheet.FormatProviders;
    using Telerik.Windows.Documents.Spreadsheet.FormatProviders.OpenXml.Xlsx;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Web;
    using System;
    using Common.Logging;

    [Authorize]
    [EnableCors]
    public class EventsController : BaseController
    {
        [Route("~/api/events/{eventID}")]
        public IHttpActionResult Get(int eventID)
        {
            ValidationResponse<EventInfo> response = Service.GetEvent(eventID);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpGet]
        [HttpPost]
        [Route("~/api/events")]
        public IHttpActionResult Get(QueryParams parameters)
        {
            if (parameters == null)
            {
                parameters = new QueryParams();
            }

            ValidationResponse<EventQueryResult> response = Service.GetEvents(parameters);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpPost]
        [Route("~/api/events/save")]
        public IHttpActionResult Save([FromBody] EventInfo eventInfo)
        {
            var response = Service.SaveEvent(eventInfo);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpDelete]
        [Route("~/api/events/{eventID}")]
        public IHttpActionResult Delete(int eventID)
        {
            ValidationResponse<bool> response = Service.DeleteEvent(eventID);

            if (response.Success)
            {
                return HttpResult.Create(Request, HttpStatusCode.NoContent);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [Route("~/api/events/{eventID}/users/save")]
        public IHttpActionResult SaveUsers(int eventID, [FromBody] List<EventUser> users)
        {
            var response = Service.SaveEventUsers(eventID, users);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [Route("~/api/events/{eventID}/fields")]
        public IHttpActionResult GetFields(int eventID)
        {
            var response = Service.GetEventFields(eventID);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [Route("~/api/events/{eventID}/fields/save")]
        public IHttpActionResult SaveFields(int eventID, [FromBody] List<EventField> fields)
        {
            if (fields != null && fields.Count == 1)
            {
                var response = Service.SaveEventField(eventID, fields[0]);

                if (response.Success)
                {
                    return Ok(response.Result);
                }
                else
                {
                    return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
                }
            }
            else
            {
                var response = Service.SaveEventFields(eventID, fields);

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

        [HttpDelete]
        [Route("~/api/events/{eventID}/fields/{fieldID}")]
        public IHttpActionResult DeleteField(int eventID, int fieldID)
        {
            ValidationResponse<bool> response = Service.DeleteEventField(eventID, fieldID);

            if (response.Success)
            {
                return GetFields(eventID);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpGet]
        [HttpPost]
        [Route("~/api/events/{eventID}/attendees")]
        public IHttpActionResult GetAttendees(int eventID, QueryParams parameters)
        {
            ValidationResponse<EventAttendeeQueryResult> response = Service.GetEventAttendees(eventID, parameters);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [Route("~/api/events/{eventID}/attendees/{attendeeID}")]
        public IHttpActionResult GetAttendee(int eventID, int attendeeID)
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

        [HttpPost]
        [Route("~/api/events/{eventID}/attendees/save")]
        public IHttpActionResult SaveAttendee(int eventID, [FromBody] EventAttendee attendee)
        {
            ValidationResponse<EventAttendee> response = Service.SaveAttendee(eventID, attendee);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [Route("~/api/events/{eventID}/attendees/saveall")]
        public IHttpActionResult SaveAttendees(int eventID, [FromBody] List<EventAttendee> attendees)
        {
            ValidationResponse<List<EventAttendee>> response = Service.SaveAttendees(eventID, attendees);

            if (response.Success)
            {
                return Ok(true);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpGet]
        [HttpPost]
        [Route("~/api/events/attendees/export/{eventID}")]
        public IHttpActionResult ExportAttendees(int eventID, QueryParams parameters)
        {
            ValidationResponse<Workbook> response = Service.ExportEventAttendees(eventID, parameters);

            if (response.Success == false)
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }

            var result = new HttpResponseMessage(HttpStatusCode.OK);

            using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
            {
                IWorkbookFormatProvider provider = new XlsxFormatProvider();
                provider.Export(response.Result, ms);

                result.Content = new ByteArrayContent(ms.ToArray());
            }
            
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = response.Result.Name + ".xlsx"
            };

            return ResponseMessage(result);
        }

        [HttpDelete]
        [Route("~/api/events/{eventID}/attendees/delete")]
        public IHttpActionResult DeleteAttendees(int eventID, [FromUri] int[] ids)
        {
            ValidationResponse<bool> response = Service.DeleteAttendees(eventID, ids);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpPost]
        [Route("~/api/events/{eventID}/uploadAttachment")]
        public IHttpActionResult UploadAttachment(int eventID)
        {
            HttpFileCollection collection = null;
            try
            {
                collection = HttpContext.Current.Request.Files;
            }
            catch (Exception ex)
            {
                Logging.LogMessage(LogLevel.Warning, $"Unable to upload file for event {eventID}. Exception: {ex} Message {ex.Message}");

                string message = "Unable to upload file.";

                if (ex.Message.Contains("length exceeded"))
                {
                    message = "Attachment is too large.";
                }
                               
                return HttpResult.Create(Request, HttpStatusCode.BadRequest, message);
            }

            if (collection != null && collection.Count == 0)
            {
                return HttpResult.Create(Request, HttpStatusCode.BadRequest, "Attachment not provided to upload.");
            }

            HttpPostedFile attachement = collection[0];
           
            ValidationResponse<string> response = Service.UploadAttachment(eventID, attachement);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpPost]
        [Route("~/api/events/{eventID}/sendrsvp")]
        public IHttpActionResult SendRsvpRequests(int eventID, [FromBody] RsvpRequest req)
        {
            ValidationResponse<bool> response = Service.SendRSVPRequests(eventID, req);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpPost]
        [Route("~/api/events/{eventID}/sendreminder")]
        public IHttpActionResult SendReminder(int eventID, [FromBody] ReminderRequest req)
        {
            ValidationResponse<bool> response = Service.SendReminderRequest(eventID, req);

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
