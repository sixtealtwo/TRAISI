using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.Authorization.Extensions
{
    [Route("api/[controller]")]
    [SurveyAuthorizationHandler(Name = "SAML2")]
    public class SAML2AuthorizationHandler : Controller, TRAISI.SDK.Interfaces.TraisiIAuthorizationHandler
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

