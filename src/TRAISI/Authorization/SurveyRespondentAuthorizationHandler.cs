using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DAL.Core;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Filters;
using DAL;

namespace TRAISI.Authorization
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="SurveyRespondentAuthorizationRequirement"></typeparam>
    public class SurveyRespondentAuthorizationHandler : AuthorizationHandler<SurveyRespondentAuthorizationRequirement>, IAuthorizationRequirement
    {

        const string HEADER_KEY_RESPONDENT_ID = "Respondent-Id";
        const string HEADER_KEY_SURVEY_ID = "Survey-Id";
        const string CLAIM_KEY_SHORTCODE = "Shortcode";

        private IUnitOfWork _unitOfWork;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="unitOfWork"></param>
        public SurveyRespondentAuthorizationHandler(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <param name="requirement"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SurveyRespondentAuthorizationRequirement requirement)
        {

            var user = context.User;

            if (user == null) {
                context.Fail();
                return Task.CompletedTask;
            }
            else if (user.IsInRole("respondent")) {
                return ProcessSurveyUser(context, requirement);
            }

            else if (context.User.IsInRole(TRAISI.Authorization.Enums.TraisiRoles.SuperAdministrator)) {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            else if (context.User.HasClaim(CustomClaimTypes.SurveyProxyRespondent, "") ||
                context.User.HasClaim(CustomClaimTypes.SurveyRespondent, "")) {
                context.Succeed(requirement);
            }

            context.Succeed(requirement);
            return Task.CompletedTask;
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <param name="requirement"></param>
        private Task ProcessSurveyUser(AuthorizationHandlerContext context, SurveyRespondentAuthorizationRequirement requirement)
        {

            var user = context.User;
            // get survey id claim
            // match with headers
            var resource = context.Resource;
            var userSurveyId = user.Claims.FirstOrDefault(claim => claim.Type == "SurveyId");
            var userShortcode = user.Claims.FirstOrDefault(claim => claim.Type == CLAIM_KEY_SHORTCODE);
            var headerRespondentId =
            (context.Resource as AuthorizationFilterContext).HttpContext.Request.Headers.
            FirstOrDefault(s => s.Key == HEADER_KEY_RESPONDENT_ID);

             var headerSurveyId =
            (context.Resource as AuthorizationFilterContext).HttpContext.Request.Headers.
            FirstOrDefault(s => s.Key == HEADER_KEY_SURVEY_ID);

            

            var routeData =
            (context.Resource as AuthorizationFilterContext).RouteData;

            var endpointRespondentId = routeData.Values.FirstOrDefault(k => k.Key == "respondentId");
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
