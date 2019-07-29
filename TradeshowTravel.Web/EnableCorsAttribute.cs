using System;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http.Cors;

namespace TradeshowTravel.Web
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class EnableCorsAttribute : Attribute, ICorsPolicyProvider
    {
        public Task<CorsPolicy> GetCorsPolicyAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var corsRequestContext = request.GetCorsRequestContext();
            var originRequested = corsRequestContext.Origin;
            var origins = ConfigurationManager.AppSettings["AllowedOrigins"].Split(';');

            if (origins.Any(corsRequestContext.RequestUri.DnsSafeHost.EndsWith))
            {
                var policy = new CorsPolicy
                {
                    AllowAnyHeader = true,
                    AllowAnyMethod = true,
                    SupportsCredentials = true
                };

                policy.Origins.Add(originRequested);

                return Task.FromResult(policy);
            }

            return null;
        }
    }
}