using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace TradeshowTravel.Web
{
    public class HttpResult : IHttpActionResult
    {
        public HttpRequestMessage Request { get; set; }
        public HttpStatusCode Status { get; set; }
        public string Message { get; set; }

        protected HttpResult()
        {
            Message = string.Empty;
        }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage()
            {
                Content = new StringContent(Message),
                RequestMessage = Request,
                StatusCode = Status
            };
            return Task.FromResult(response);
        }

        public static HttpResult Create(HttpRequestMessage request, HttpStatusCode status, string message = "")
        {
            return new HttpResult()
            {
                Request = request,
                Status = status,
                Message = message ?? string.Empty
            };
        }
    }
}