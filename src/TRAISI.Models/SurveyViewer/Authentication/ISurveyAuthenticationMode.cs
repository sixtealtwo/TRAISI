using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Traisi.SurveyViewer.Authentication {
	public interface ISurveyAuthenticationMode {
		string ModeName { get; set; }

		void ReadOptions (IConfigurationSection optionsSection);

	}
}