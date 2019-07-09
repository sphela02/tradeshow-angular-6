using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.IO;
using System.IO.Compression;
using System.Net.Mime;

namespace TradeshowTravel.Web.Controllers
{
    using Domain.DTOs;
    using System.Net.Http.Headers;

    [Authorize]
    [EnableCors]
    public class UserImageController : BaseController
    {
        [HttpPost]
        [HttpGet]
        [Route("~/api/SaveAvatar/{username}")]
        public IHttpActionResult SaveAvatar(string username)
        {
            var file = HttpContext.Current.Request.Files.Count > 0 ?
                HttpContext.Current.Request.Files[0] : null;

            ValidationResponse<bool> response = Service.SaveImage(username.ToUpper(), file, "AVATAR", null);
            if (response.Success)
            {
                return HttpResult.Create(Request, HttpStatusCode.NoContent);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpGet]
        [Route("~/api/GetAvatar/{username}")]
        public HttpResponseMessage Get(string username)
        {
            try
            {
                UserImages ui = Service.GetAvatar(username.ToUpper());
                MemoryStream ms = new MemoryStream(ui.Image);
                HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);

                result.Content = new StreamContent(ms);
                result.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(ui.ImageType);

                return result;
            }
            catch
            {
                //    return new HttpResponseMessage(HttpStatusCode.InternalServerError);
                return new HttpResponseMessage(HttpStatusCode.NoContent);
            }
        }

        [HttpGet]
        [HttpPost]
        [Route("~/api/TravelDocs/{username}")]
        public IHttpActionResult GetTravelDocs(string username)
        {
            ValidationResponse<List<UserImages>> response = Service.GetTravelDocs(username.ToUpper());

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
        [Route("~/api/TravelDocs")]
        public IHttpActionResult DownloadAttendeeDocuments([FromUri] int[] ids)
        {
            var attendees = Service.GetAttendeeDocuments(ids);

            using (var stream = new MemoryStream())
            {
                using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, true))
                {
                    foreach (var attendeeGroup in attendees.Result.GroupBy(x => x.Username))
                    {
                        foreach (var attendeeImage in attendeeGroup)
                        {
                            string fileExtension;

                            switch (attendeeImage.ImageType)
                            {
                                case MediaTypeNames.Image.Jpeg:
                                    fileExtension = ".jpeg";
                                    break;
                                case MediaTypeNames.Image.Gif:
                                    fileExtension = ".gif";
                                    break;
                                case "application/png":
                                    fileExtension = ".png";
                                    break;
                                default:
                                    continue;
                            }

                            ZipArchiveEntry entry = archive.CreateEntry($"{attendeeImage.Username.ToLower()}/{attendeeImage.Category.ToLower()}{fileExtension}");

                            using (var image = new MemoryStream(attendeeImage.Image))
                            {
                                using (Stream zipEntryStream = entry.Open())
                                {
                                    image.CopyTo(zipEntryStream);
                                }
                            }
                        }
                    }
                }

                stream.Seek(0, SeekOrigin.Begin);

                var result = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(stream.ToArray())
                    {
                        Headers =
                        {
                            ContentDisposition = new ContentDispositionHeaderValue(DispositionTypeNames.Attachment) { FileName = $"{DateTime.Now.ToFileTime()}.zip" },
                            ContentType = new MediaTypeHeaderValue(MediaTypeNames.Application.Octet)
                        }
                    }
                };

                return ResponseMessage(result);
            }
        }

        [HttpPost]
        [Route("~/api/TravelDocs/Save/{username}/{category}/{description}")]
        public IHttpActionResult SaveTravelDocs(string username, string category, string description)
        {
            var file = HttpContext.Current.Request.Files.Count > 0 ?
               HttpContext.Current.Request.Files[0] : null;

            ValidationResponse<bool> response = Service.SaveImage(username.ToUpper(), file, category.ToUpper(), description);
            if (response.Success)
            {
                return HttpResult.Create(Request, HttpStatusCode.NoContent);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpPost]
        [HttpDelete]
        [Route("~/api/TravelDocs/Delete/{username}")]
        public IHttpActionResult DeleteImage(string username, [FromBody] List<string> categories)
        {
            ValidationResponse<bool> response = Service.DeleteImages(username, categories);
            if (response.Success)
            {
                return Ok(true);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }
    }
}
