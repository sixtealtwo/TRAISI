using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;

namespace DAL.Repositories.Interfaces {
	public interface ISurveyResponseRepository : IRepository<SurveyResponse> {
		/// <summary>
		/// 
		/// </summary>
		/// <param name="questionId"></param>
		/// <returns></returns>
		Task<List<SurveyResponse>> ListQuestionResponsesForRespondentAsync(int questionId, string shortcode);

		/// <summary>
		/// 
		/// </summary>
		/// <param name="user"></param>
		/// <param name="questionName"></param>
		/// <returns></returns>
		Task<SurveyResponse> GetQuestionResponeByQuestionName(SurveyRespondent user, string questionName);


		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="user"></param>
		/// <returns></returns>
		Task<List<SurveyResponse>> ListMostRecentQuestionResponsesForRespondentAsync(int surveyId, SurveyRespondent user);

		Task<List<SurveyResponse>> ListSurveyResponsesForRespondentByTypeAsync(int surveyId, SurveyRespondent user, string type );

		/// <summary>
		/// 
		/// </summary>
		/// <param name="questionId"></param>
		/// <param name="user"></param>
		/// <returns></returns>
		Task<SurveyResponse> GetMostRecentResponseForQuestionByRespondentAsync(int questionId, SurveyRespondent user);
	}
}