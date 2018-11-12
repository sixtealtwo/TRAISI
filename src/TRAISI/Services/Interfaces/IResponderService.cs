using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;
using Newtonsoft.Json.Linq;

namespace TRAISI.Services.Interfaces
{
    public interface IResponderService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <param name="user"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        Task<bool> SaveResponse(int surveyId, int questionId, ApplicationUser user, int respondentId, JObject responseData, int repeat);

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
        /// <param name="surveyId"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        Task<List<SurveyResponse>> ListResponsesOfType(int surveyId, string type, ApplicationUser user);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        Task<SurveyResponse> GetRespondentMostRecentResponseForQuestion(int surveyId, int questionId, int respondentId, int repeat,
            ApplicationUser user);




        /// <summary>
        /// 
        /// </summary>
        /// <param name="questionIds"></param>
        /// <returns></returns>
        Task<List<SurveyResponse>> ListSurveyResponsesForQuestionsAsync(List<int> questionIds, int respondentId);



        /// <summary>
        /// 
        /// </summary>
        /// <param name="respondentId"></param>
        /// <returns></returns>
        Task<bool> RemoveAllResponses(int surveyId, int respondentId, ApplicationUser user);
    }
}