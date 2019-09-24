using System;
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
using Traisi.SurveyViewer.Authentication;

namespace TRAISI.Authorization {
	public class SurveyAuthenticationService {

		private readonly IConfiguration _configuration;

		public Dictionary<string, ISurveyAuthenticationMode> SurveyAuthenticationModes { get; set; }

		/// <summary>
		/// 
		/// </summary>
		/// <param name="signInManager"></param>
		/// <param name="userManager"></param>
		/// <param name="accountManager"></param>
		public SurveyAuthenticationService (

			IConfiguration configuration) {
			this._configuration = configuration;

			this.InitializeSurveyAuthModes ();
		}

		private void InitializeSurveyAuthModes () {
			SurveyAuthenticationModes = new Dictionary<string, ISurveyAuthenticationMode> ();

			var authModes = _configuration.GetSection ("SurveyAuthenticationModes").GetChildren ();
			foreach (var section in authModes) {
				string code = section.GetValue<string> ("SurveyCode");
				string mode = section.GetValue<string> ("AuthenticationMode");
				var options = section.GetSection ("Options");

				var type = Type.GetType (mode);
				if (type == null) {
					continue;
				}
				if (type != null) {
					var authMode = (ISurveyAuthenticationMode) Activator.CreateInstance (type);
					authMode.ReadOptions (options);
					this.SurveyAuthenticationModes[code] = authMode;
				}

			}
			return;

		}

	}

}