using System;
using System.Security.Claims;
using System.Threading.Tasks;
using TRAISI.Data.Core;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Filters;
using TRAISI.Data;

namespace TRAISI.Authorization
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="SurveyRespondentAuthorizationRequirement"></typeparam>
    public class SurveyRespondentAuthorizationRequirement : IAuthorizationRequirement
    {

        

        public SurveyRespondentAuthorizationRequirement()
        {
   
        }
    }
}