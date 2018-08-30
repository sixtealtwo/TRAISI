using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models.Surveys;

namespace TRAISI.Services.Interfaces
{
    public interface IRespondentService
    {


        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="shortcode"></param>
        /// <param name="questionId"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        Task<bool> SaveResponse(int surveyId, string shortcode, int questionId, object responseData);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="shortcode"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        Task<List<SurveyResponse>> ListResponses(int surveyId, string shortcode, int questionId);
    }
}