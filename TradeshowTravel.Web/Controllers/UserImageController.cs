using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.IO;

namespace TradeshowTravel.Web.Controllers
{
    using Domain.DTOs;

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
    }
}
