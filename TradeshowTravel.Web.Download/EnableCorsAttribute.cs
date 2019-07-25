using System;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http.Cors;

namespace TradeshowTravel.Web.Download
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public class EnableCorsAttribute : Attribute, ICorsPolicyProvider
    {
        private CorsPolicy _policy;

        public EnableCorsAttribute()
        {
            _policy = new CorsPolicy
            {
                AllowAnyHeader = true,
                AllowAnyMethod = true,
                SupportsCredentials = true
            };
        }

        public Task<CorsPolicy> GetCorsPolicyAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var policy = new CorsPolicy();
            var requestUri = request.RequestUri;
            var authority = requestUri.Authority.ToLowerInvariant();
            var origins = ConfigurationManager.AppSettings["AllowedOrigins"].Split(';');

            if (origins.Any(x => authority.EndsWith(x)))
            {
                var origin = requestUri.GetComponents(System.UriComponents.SchemeAndServer, System.UriFormat.SafeUnescaped);
                policy.Origins.Add(origin);
            }

            return Task.FromResult(_policy);
        }
    }
}