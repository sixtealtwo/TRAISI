using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.Authorization.Extensions
{
    [SurveyAuthorizationHandler(Name="SAML2")]
    [Route("api/[controller]")]
    public class SAML2AuthorizationHandler : Controller, ITraisiIAuthorizationHandler
    {

        [ExtensionConfigurationAttribute(Name = "Sign On URL", Description = "URL of sign on location")]
        public string SignOnURL { get; set; }

        [HttpGet]
        [Route("login")]
        public IActionResult Login()
        {
            return Ok();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [NonAction]
        public bool ShouldAuthorize(HttpContext s)
        {
            throw new NotImplementedException();
        }
    }

}

