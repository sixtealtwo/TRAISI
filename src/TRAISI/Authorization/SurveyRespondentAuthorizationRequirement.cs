using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DAL.Core;
using Microsoft.AspNetCore.Authorization;

namespace TRAISI.Authorization {
	public class SurveyRespondentAuthorizationRequirement : AuthorizationHandler<SurveyRespondentAuthorizationRequirement>, IAuthorizationRequirement {
		
		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <param name="requirement"></param>
		/// <returns></returns>
		/// <exception cref="NotImplementedException"></exception>
		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SurveyRespondentAuthorizationRequirement requirement) {

			var user = context.User;

			if(user == null)
			{
				context.Fail();
				return Task.CompletedTask;
			}

			else if(context.User.IsInRole(TRAISI.Authorization.Enums.TraisiRoles.SuperAdministrator))
			{
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
	}
}
