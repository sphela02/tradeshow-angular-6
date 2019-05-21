using System.Collections.Generic;
using System.Net;
using System.Web.Http;

namespace TradeshowTravel.Web.Controllers
{
    using Domain.DTOs;

    [Authorize]
    [EnableCors]
    public class UsersController : BaseController
    {
        [HttpGet]
        [Route("~/api/users/search")]
        public IHttpActionResult Search(string username = null, string name = null, int size = 15, int skip = 0)
        {
            return Ok(Service.GetUsers(username, name, size, skip));
        }

        [HttpGet]
        [Route("~/api/privileged/{privilege}/users")]
        public IHttpActionResult GetPrivilegedUsers(Permissions privilege)
        {
            ValidationResponse<List<UserProfile>> response = Service.GetPrivilegedUsers(privilege);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [Route("~/api/privileged/{privilege}/save")]
        public IHttpActionResult SavePrivilegedUsers(Permissions privilege, [FromBody] List<string> usernames)
        {
            ValidationResponse<bool> response = Service.SavePrivilegedUsers(privilege, usernames);

            if (response.Success)
            {
                return HttpResult.Create(Request, HttpStatusCode.NoContent);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [HttpDelete]
        [Route("~/api/privileged/{privilege}/{username}")]
        public IHttpActionResult RemovePrivilegedUsers(Permissions privilege, string username)
        {
            ValidationResponse<bool> response = Service.RemovePrivilegedUser(privilege, username);

            if (response.Success)
            {
                return HttpResult.Create(Request, HttpStatusCode.NoContent);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [Route("~/api/users/me")]
        public IHttpActionResult Get()
        {
            return Ok(Service.CurrentUser);
        }

        [Route("~/api/users/{username}")]
        public IHttpActionResult Get(string username)
        {
            ValidationResponse<UserProfile> response = Service.GetUserProfile(username);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, HttpStatusCode.InternalServerError, response.Message);
            }
        }

        [Route("~/api/users/{username}/delegate")]
        public IHttpActionResult GetDelegate(string username)
        {
            ValidationResponse<UserInfo> response = Service.GetDelegate(username);

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
        [Route("~/api/users/save")]
        public IHttpActionResult Save([FromBody] UserProfile profile)
        {
            ValidationResponse<UserProfile> response = Service.SaveProfile(profile);

            if (response.Success)
            {
                return Ok(response.Result);
            }
            else
            {
                return HttpResult.Create(Request, System.Net.HttpStatusCode.InternalServerError, response.Message);
            }
        }
    }
}
