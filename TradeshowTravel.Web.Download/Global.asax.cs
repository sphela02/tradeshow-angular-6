﻿using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using NLog;

namespace TradeshowTravel.Web.Download
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        public ILogger theLogger { get; } = NLog.LogManager.GetCurrentClassLogger();

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);

            theLogger.Info("Application Started");
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            if (Request.Headers.AllKeys.Contains("Origin") && Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", Request.Headers["Origin"]);
                Response.Headers.Add("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token, Authorization");
                Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
                Response.Headers.Add("Access-Control-Allow-Credentials", "true");
                Response.Headers.Add("Access-Control-Max-Age", "1728000");
                Response.End();
            }
        }
    }
}
