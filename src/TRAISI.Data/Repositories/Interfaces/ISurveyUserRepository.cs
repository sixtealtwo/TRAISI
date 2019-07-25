using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;

namespace DAL.Repositories.Interfaces
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