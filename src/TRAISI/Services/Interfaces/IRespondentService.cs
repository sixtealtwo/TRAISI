using System.Threading.Tasks;

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
    }
}