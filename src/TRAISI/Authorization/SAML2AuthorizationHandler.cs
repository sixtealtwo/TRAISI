using System;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using DAL;
using DAL.Core.Interfaces;
using DAL.Models;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;
using TRAISI.ViewModels.Users;

namespace TRAISI.Authorization.Extensions
{
    [SurveyAuthorizationHandler(Name = "SAML2")]
    [Route("api/[controller]")]
    public class SAML2AuthorizationHandler : Controller, ITraisiIAuthorizationHandler
    {

        [ExtensionConfigurationAttribute(Name = "Sign On URL", Description = "URL of sign on location")]
        public string SignOnURL { get; set; }

        private readonly UserManager<TraisiUser> _userManager;

        private readonly AuthenticationService _authenticationService;

        private readonly IAccountManager _accountManager;

        private readonly IUnitOfWork _unitOfWork;


        /// <summary>
        /// 
        /// </summary>
        /// <param name="userManager"></param>
        public SAML2AuthorizationHandler(UserManager<TraisiUser> userManager,
        AuthenticationService authenticationService,
        IAccountManager accountManager,
        IUnitOfWork unitofWork)
        {
            this._userManager = userManager;
            this._authenticationService = authenticationService;
            this._accountManager = accountManager;
            this._unitOfWork = unitofWork;
        }

        [HttpGet]
        [Route("login/{surveyCode}")]
        public async Task<IActionResult> Login(string surveyCode)
        {

            var headers = Request.HttpContext.Request.Headers;
            var user = headers["subject-id"];
            var survey = await this._unitOfWork.Surveys.GetSurveyByCodeFullAsync(surveyCode);

            if (survey == null) {
                return new NotFoundResult();
            }

            Shortcode shortcode = new Shortcode();
            shortcode.Code = user.ToString();
            shortcode.Survey = survey;
            shortcode.CreatedDate = DateTime.Now;

            SurveyUser surveyUser = Mapper.Map<SurveyUser>(new UserViewModel { UserName = Guid.NewGuid().ToString("D") });
            var result = await _accountManager.CreateSurveyUserAsync(surveyUser, shortcode, null,
                new (string claimName, string claimValue)[] { ("SurveyId", survey.Id.ToString()), ("Shortcode", shortcode.Code) });

            OpenIdConnectRequest request = new OpenIdConnectRequest();
            request.AddParameter("username", user.ToString());
            request.AddParameter("password", user.ToString());
            request.AddParameter("grant_type", "password");
            request.AddParameter("scope", new string[] { "openid", "email", "phone", "profile", "offline_access", "roles" });
            request.AddParameter("resource", Request.Host.Value);

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

