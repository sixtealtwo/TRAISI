
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Server;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;

namespace TRAISI.Authorization
{
    public class SurveyAuthorizationService
    {

        private readonly SignInManager<ApplicationUser> _signInManager;

        private readonly IOptions<IdentityOptions> _identityOptions;

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly IConfiguration _configuration;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="signInManager"></param>
        /// <param name="userManager"></param>
        /// <param name="accountManager"></param>
        public SurveyAuthorizationService(
            IOptions<IdentityOptions> identityOptions,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IAccountManager accountManager,
            IConfiguration configuration)
        {
            this._signInManager = signInManager;
            this._identityOptions = identityOptions;
            this._userManager = userManager;
            this._configuration = configuration;
        }

        
    }

}