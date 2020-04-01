using System.Threading.Tasks;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Surveys;

namespace TRAISI.Data.Repositories.Interfaces
{
	public interface ISurveyUserRepository : IRepository<SurveyUser>
	{
		/// <summary>
		/// 
		/// </summary>
		/// <param name="survey"></param>
		/// <param name="shortcode"></param>
		/// <returns></returns>
		Task<SurveyUser> GetSurveyUserAsync(Survey survey, string shortcode);

		Task<SurveyUser> GetSurveyUserAsync(int surveyId, string shortcode);
	}
}