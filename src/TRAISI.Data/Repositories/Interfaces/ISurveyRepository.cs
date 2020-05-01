using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TRAISI.Data.Core;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Surveys;

namespace TRAISI.Data.Repositories.Interfaces {
	public interface ISurveyRepository : IRepository<Survey> {
		void LoadSurveyFromJson (Stream data);

		Task<IEnumerable<Survey>> GetAllUserSurveysAsync (string userName);

		Task<IEnumerable<Survey>> GetAllGroupSurveysAsync (string groupName);

		Task<IEnumerable<Survey>> GetAllGroupSurveysAsync (string groupName, string exceptUserName);

		Task<Survey> GetSurveyWithPermissionsAsync (int id);

		Task<Survey> GetSurveyWithUserPermissionsAsync (int id, string userName);

		Task<IEnumerable<Survey>> GetSharedSurveysAsync (string userName);

		Task<Survey> GetSurveyByNameFullAsync (string name);

		Task<Survey> GetSurveyByCodeAsync (string code);

		Task<Survey> GetSurveyByCodeFullAsync (string code);

		Task<Survey> GetSurveyLabelsAndPartsAsync (int surveyId);

		Task<Survey> GetSurveyFullAsync (int surveyId, SurveyViewType viewType);

		Task<Survey> GetSurveyWithLabelsAsync (int surveyId, SurveyViewType viewType);

		Task<Survey> GetSurveyFullExportAsync (int surveyId);

		Task<Survey> GetSurveyWithShortcodeAsync (int surveyId, string shortcode);

		Task<bool> ExistsSurveyWithGroupcodeAsync (int surveyId, string groupcode);

		Task<Survey> GetSurveyWithGroupcodeAsync (int surveyId, string groupcode);
		
		Task<Survey> GetSurveyWithSurveyLogic(int id);

		bool QuestionNameIsUnique (int surveyId, string name, string oldName);

	}
}