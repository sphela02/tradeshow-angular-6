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
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class EnableCorsAttribute : Attribute, ICorsPolicyProvider
    {
        public Task<CorsPolicy> GetCorsPolicyAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var policy = new CorsPolicy
            {
                AllowAnyHeader = true,
                AllowAnyMethod = true,
                SupportsCredentials = true
            };

            var requestUri = request.RequestUri;
            var authority = requestUri.Authority.ToLowerInvariant();
            var origins = ConfigurationManager.AppSettings["AllowedOrigins"].Split(';');

            if (origins.Any(x => authority.EndsWith(x)))
            {
                var origin = requestUri.GetComponents(UriComponents.SchemeAndServer, UriFormat.SafeUnescaped);
                policy.Origins.Add(origin);
            }

            return Task.FromResult(policy);
        }
    }
}