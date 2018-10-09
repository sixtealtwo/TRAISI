using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;
using Newtonsoft.Json.Linq;

namespace TRAISI.Services.Interfaces {
	public interface IRespondentService {
		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="questionId"></param>
		/// <param name="user"></param>
		/// <param name="responseData"></param>
		/// <returns></returns>
		Task<bool> SaveResponse(int surveyId, int questionId, ApplicationUser user, JObject responseData);

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="questionId"></param>
		/// <param name="subRespondentId"></param>
		/// <param name="responseData"></param>
		/// <returns></returns>
		Task<bool> SaveSubResponse(int questionId, int subRespondentId, JObject responseData);

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="shortcode"></param>
		/// <param name="questionId"></param>
		/// <returns></returns>
		Task<List<SurveyResponse>> ListResponses(int surveyId, string questionName);


		/// <summary>
		/// 
		/// </summary>
		/// <param name="questionId"></param>
		/// <param name="user"></param>
		/// <returns></returns>
		Task<SurveyResponse> GetRespondentMostRecentResponseForQuestion(int surveyId, int questionId,
			ApplicationUser user);
	}
}