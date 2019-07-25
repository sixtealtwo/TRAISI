using System;
using Microsoft.AspNetCore.Http;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.Authorization.Extensions
{
    [SurveyAuthorizationHandler(Name="SAML2")]
    public class SAML2AuthorizationHandler : TRAISI.SDK.Interfaces.IAuthorizationHandler
    {
        
        public bool ShouldAuthorize(HttpContext s)
        {
            throw new NotImplementedException();
        }
    }

}

