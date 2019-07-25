using System;
using Microsoft.AspNetCore.Http;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.Authorization.Extensions
{
    [SurveyAuthorizationHandler(Name="CANARIE")]
    public class CanarieAuthorizationHandler : ITraisiAuthorizationHandler
    {
        
        public bool ShouldAuthorize(HttpContext s)
        {
            throw new NotImplementedException();
        }
    }

}

