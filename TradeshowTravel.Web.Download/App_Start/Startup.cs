﻿using Microsoft.AspNet.Identity;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using Owin;
using System.Threading.Tasks;
using System.Configuration;

namespace TradeshowTravel.Web.Download
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            string clientId = ConfigurationManager.AppSettings["TokenValidation_ClientId"];
            string discoveryUrl = ConfigurationManager.AppSettings["TokenValidation_DiscoveryUrl"];

            var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(discoveryUrl, new OpenIdConnectConfigurationRetriever(),
                new HttpDocumentRetriever());

            var openIdConnectConfig = Task.Run(() => configurationManager.GetConfigurationAsync()).GetAwaiter().GetResult();

            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions()
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    AuthenticationType = DefaultAuthenticationTypes.ExternalBearer,
                    TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidAudience = clientId,
                        ValidateAudience = true,
                        ValidIssuer = openIdConnectConfig.Issuer,
                        ValidateIssuer = true,                     
                        IssuerSigningKeyResolver = (t, st, i, p) => openIdConnectConfig.SigningKeys,
                        NameClaimType = "eca"
                    }
                }
            );

            app.SetDefaultSignInAsAuthenticationType(DefaultAuthenticationTypes.ExternalBearer);
        }
    }
}