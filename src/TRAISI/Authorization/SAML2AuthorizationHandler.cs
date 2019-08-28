using System;
using Microsoft.AspNetCore.Http;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.Authorization.Extensions
{
    [SurveyAuthorizationHandler(Name="SAML2")]
    public class SAML2AuthorizationHandler : TRAISI.SDK.Interfaces.TraisiIAuthorizationHandler
    {

        [ExtensionConfigurationAttribute(Name="Sign On URL", Description="URL of sign on location")]
        public string SignOnURL {get;set;}
        
        public bool ShouldAuthorize(HttpContext s)
        {
            throw new NotImplementedException();
        }
    }

}

