L3Harris.OpenIdAuthenticationLegacy NuGet package

Purpose:
To authenticate users from both old Harris and old L3 in a Web API by using OpenID Connect as a protocol for authentication.

Requirements: Consuming applications must be a ASP.NET Web API 2.0 project. For MVC projects, please use the L3Harris.WsFederationAuthenticaitonLegacy package.

Developer Setup:

Resolve namespace in new Startup.cs file (currently set to OpenIdSample)

Add [Authorize] attribute to other API controller to ensure user is authenticated example: [Authorize] public class HomeController : Controller

Modify value for web.config key 'TokenValidation_DiscoveryUrl' with path of the discovery EndPoint of the SSO server. It should be https://sso.l3harris.com/ofisid/api/discovery

Modify value for web.config key ‘TokenValidation_ClientId’ with your app id.

Modify value for web.config key 'AllowedOrigins' with allowed origins if the Web API needs CORS enabled. Example from other app: localhost;l3harris.com

Verify Web.config transforms contain the allow user element once only (should not be in local) <system.webServer> </system.webServer>

Pull user data as needed by casting the user identity. 
example: 
ClaimsIdentity identity = (ClaimsIdentity)User.Identity; string username = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.WindowsAccountName).Value;

Or User.Identity.Name to get the Login ID

Delete READ_ME_OpenId.md