using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;

namespace DAL.Repositories.Interfaces
{
	public interface ISurveyViewRepository : IRepository<SurveyView>
	{
		Task<List<SurveyView>> GetSurveyViews(int surveyId);
		Task<SurveyView> GetSurveyViewWithPagesStructureAsync(int surveyId, string viewName);
	}
}