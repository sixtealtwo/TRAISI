// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;

namespace DAL.Repositories.Interfaces
{
	public interface IShortcodeRepository : IRepository<Shortcode>
	{
		Task<IEnumerable<Shortcode>> GetShortcodesForSurvey(int surveyId, bool isTest);
		bool UniqueShortCodeForSurvey(int surveyId, string code);
	}
}