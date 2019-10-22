using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Traisi.SurveyViewer.Authentication {

	public class TraisiAuthentication : ISurveyAuthenticationMode {
		public readonly static string TRAISI_AUTHENTICATION = "TRAISI_AUTHENTICATION";
		public string ModeName { get; set; } = TRAISI_AUTHENTICATION;

		public void ReadOptions (IConfigurationSection optionsSection) {
			return;
		}
	}
}